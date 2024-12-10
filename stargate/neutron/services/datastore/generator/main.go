package main

import (
	"fmt"
	"github.com/sirupsen/logrus"
	"go/ast"
	"go/format"
	"go/parser"
	"go/token"
	"log"
	"multiverse-authorization/neutron/services/datastore"
	"os"
	"path/filepath"
	"reflect"
	"regexp"
	"strings"
)

type ModelField struct {
	Name     string
	Type     string
	DbColumn string
	DbType   string
}

func main() {

	logrus.SetLevel(logrus.DebugLevel)
	a, err := os.Getwd()
	log.Println("dir", a, err)
	log.Println("args", os.Args)
	goFile := os.Getenv("GOFILE")
	log.Println("goFile", goFile)

	fullPath := ""
	if goFile == "" {
		fullPath = os.Args[1]
	} else {
		fullPath = a + "/" + goFile
	}
	log.Println("goFile", fullPath)

	if fullPath == "" {
		log.Fatalln("请指定文件路径")
	}

	data, err := os.ReadFile(fullPath)
	if err != nil {
		panic(err)
	}
	fileContent := string(data)
	fset := token.NewFileSet() // positions are relative to fset
	f, err := parser.ParseFile(fset, "", fileContent, parser.ParseComments)
	if err != nil {
		panic(err)
	}

	sb := &strings.Builder{}
	packageAndImport := `
package %s

import (
	"multiverse-authorization/neutron/services/datastore"
)
`
	packageAndImport = fmt.Sprintf(packageAndImport, f.Name.Name)
	sb.WriteString(packageAndImport)

	logrus.Debugln("f name", f.Name.Name)

	for _, node := range f.Decls {
		nodeType := reflect.TypeOf(node)
		log.Println("nodeType", nodeType.String())
		switch node.(type) {

		case *ast.GenDecl:
			genDecl := node.(*ast.GenDecl)

			for _, spec := range genDecl.Specs {
				specType := reflect.TypeOf(spec)
				logrus.Debugln("specType", specType.String())
				switch spec.(type) {
				case *ast.TypeSpec:
					typeSpec := spec.(*ast.TypeSpec)

					fmt.Printf("Struct: name=%s\n", typeSpec.Name.Name)

					switch typeSpec.Type.(type) {
					case *ast.StructType:
						fmt.Printf("Struct: doc=%s\n", genDecl.Doc.Text())
						text, err := ParseAstStructType(genDecl, typeSpec, typeSpec.Type.(*ast.StructType))
						if err != nil {
							log.Fatalln("生成失败", err)
						}
						sb.WriteString(text)
					}
				}
			}
		}
	}

	dir := filepath.Dir(fullPath)

	genFilePath := dir + "/" + strings.TrimRight(filepath.Base(fullPath), filepath.Ext(fullPath)) + ".table.go"
	os.Remove(genFilePath)
	file, err := os.Create(genFilePath)
	if err != nil {
		log.Fatalln("生成失败2", err)
	}
	defer file.Close()

	//table := &ModelTable{}
	//if err := sqlxsvc.Put(table); err != nil {
	//	log.Fatalln("生成失败3", err)
	//}

	sourceText := sb.String()
	fmt.Printf("sourceText======================\n%s\n======================\n", sourceText)
	fmt.Fprintf(file, sourceText)
	formatted, err := format.Source([]byte(sourceText))
	if err != nil {
		log.Fatalln("生成失败4", err)
	}
	formattedSource := string(formatted)
	file.Seek(0, 0)

	fmt.Fprintf(file, formattedSource)
	//fmt.Printf("formattedSource======================\n%s\n======================\n", formattedSource)
}

func findTableName(src string) string {
	compileRegex := regexp.MustCompile("table: ([a-zA-Z_]+)") // 中文括号，例如：华南地区（广州） -> 广州
	matchArr := compileRegex.FindStringSubmatch(src)

	if len(matchArr) > 0 {
		fmt.Println("提取字符串内容：", matchArr[len(matchArr)-1])
	}

	if len(matchArr) > 0 {
		return matchArr[len(matchArr)-1]
	}
	return ""
}

func ParseAstStructType(genDecl *ast.GenDecl, typeSpec *ast.TypeSpec, structType *ast.StructType) (string, error) {
	sb := &strings.Builder{}

	tableName := ""

	comments := genDecl.Doc.Text()
	for _, v := range strings.Split(comments, "\n") {
		tn := findTableName(v)
		if tn != "" {
			tableName = tn
			break
		}
	}
	if tableName == "" {
		tableName = strings.ToLower(typeSpec.Name.Name)
	}
	logrus.Debugln("tableName", tableName)

	name := typeSpec.Name.Name
	if strings.HasSuffix(name, "Model") {
		name = name[:len(name)-5]
	}

	fields := make([]ModelField, 0)

	for _, field := range structType.Fields.List {
		i, ok := field.Type.(*ast.Ident)
		if !ok {
			i, ok = field.Type.(*ast.SelectorExpr).X.(*ast.Ident)
		}
		fieldType := i.Name

		for _, name := range field.Names {
			dbTag := reflect.StructTag(field.Tag.Value).Get("db")
			//fmt.Printf("\tField: name=%s type=%s tag=%s\n", name.Name, fieldType, tagValue)
			if dbTag == "" {
				dbTag = strings.ToLower(name.Name)
			}
			fields = append(fields, ModelField{
				Name:     name.Name,
				Type:     fieldType,
				DbColumn: dbTag,
				DbType:   datastore.TypeToDbType(fieldType),
			})
		}
	}

	declareText := ""
	for _, v := range fields {
		dbFieldsTemplate := `%s  datastore.ModelCondition`
		declareText += fmt.Sprintf(dbFieldsTemplate+"\n", v.Name)
	}
	//dbFieldsText = strings.TrimRight(dbFieldsText, ",")

	sb.WriteString(fmt.Sprintf(`type %sSchema struct {
%s 
}
`, name, declareText))

	assignText := ""
	conditionsText := ""
	for _, v := range fields {
		dbFieldsTemplate := `%s: datastore.NewCondition("%s", "%s", "%s", "%s"),`
		assignText += fmt.Sprintf(dbFieldsTemplate+"\n", v.Name, v.Name, v.Type, v.DbColumn, v.DbType)
		conditionsText += fmt.Sprintf("r.%s,\n", v.Name)
	}

	sb.WriteString(fmt.Sprintf(`

func New%sSchema() %sSchema {
	where := %sSchema{
		%s
	}
	return where
}
	`, name, name, name, assignText))

	sb.WriteString(fmt.Sprintf(`
func (r %sSchema) GetConditions() []datastore.ModelCondition {
	return []datastore.ModelCondition{
		%s
	}
}
`, name, conditionsText))

	sb.WriteString(fmt.Sprintf(`
	var %sDataSet = datastore.NewTable[%sSchema, %sModel]("%s",
		New%sSchema())
`, name, name, name, tableName, name))

	sourceText := sb.String()
	return sourceText, nil
}
