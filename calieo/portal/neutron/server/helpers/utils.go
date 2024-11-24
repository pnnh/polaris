package helpers

import (
	"fmt"
	"html/template" 
	"time" 
)

func FmtTimeUnix(unix int64) string {
	t := time.Unix(unix, 0)
	return t.Format("2006年01月02日 15:04")
}

func FmtTime(t time.Time) string {
	return t.Format("2006年01月02日 15:04")
}
  
func EqString(a interface{}, b string) bool {
	if fmt.Sprintf("%s", a) == b {
		return true
	}
	return false
}
 

func FuncMap() template.FuncMap {
	funcMap := template.FuncMap{ 
		"eqString":    EqString,
		"fmtTime":     FmtTime,
		"fmtTimeUnix": FmtTimeUnix,
	}
	return funcMap
}
