package server

import (
	"bytes"
	"net/http"
	"regexp"
	"strconv"

	"github.com/sirupsen/logrus"
	minify "github.com/tdewolff/minify/v2"
	"github.com/tdewolff/minify/v2/css"
	"github.com/tdewolff/minify/v2/html"
	"github.com/tdewolff/minify/v2/js"
)

var (
	minifier  *minify.M
	mediaType *regexp.Regexp
)

func init() {
	minifier = minify.New()
	minifier.AddFunc("text/css", css.Minify)
	minifier.AddFunc("text/html", html.Minify)
	minifier.AddFunc("text/javascript", js.Minify)

	mediaType = regexp.MustCompile("text/[html|css|javascript]")
}

type minifyWriter struct {
	http.ResponseWriter
	Body        *bytes.Buffer
	code        int
	wroteHeader bool
}

func (m *minifyWriter) Header() http.Header {
	return m.ResponseWriter.Header()
}

func (m *minifyWriter) WriteHeader(code int) {
	if !m.wroteHeader {
		m.code = code
		m.wroteHeader = true
		m.ResponseWriter.WriteHeader(code)
	}
}

func (m *minifyWriter) Write(b []byte) (int, error) {
	h := m.ResponseWriter.Header()
	if h.Get("Content-Type") == "" {
		h.Set("Content-Type", http.DetectContentType(b))
	}

	if !m.wroteHeader {
		m.WriteHeader(http.StatusOK)
	}

	if m.Body != nil {
		m.Body.Write(b)
	}
	return len(b), nil
}

func Minify(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		mw := &minifyWriter{
			ResponseWriter: w,
			Body:           &bytes.Buffer{},
		}

		h.ServeHTTP(mw, r)

		hdr := w.Header()
		ct := hdr.Get("Content-Type")
		if mediaType.MatchString(ct) {
			buffer := bytes.NewBuffer([]byte{})
			if err := minifier.Minify(ct, buffer, mw.Body); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				logrus.Println("压缩响应出错: %w", err)
				return
			}
			hdr.Del("Content-Length")
			hdr.Set("Content-Length", strconv.Itoa(buffer.Len()))

			if _, err := w.Write(buffer.Bytes()); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				logrus.Println("写入响应出错: %w", err)
				return
			}
		} else {
			if _, err := w.Write(mw.Body.Bytes()); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				logrus.Println("写入原始响应出错: %w", err)
				return
			}
		}
	})
}
