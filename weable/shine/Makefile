all : release

DIR := $(CURDIR)

setup :
	-mkdir $(DIR)/output
	-echo "Version = \"`openssl rand -base64 3 | md5sum | cut -c1-8`\"" > $(DIR)/output/version.txt

assets : setup
	-cd $(DIR) && cp -r assets output

release : assets
	cargo build --release --package server
	-cp target/release/server output

debug : assets
	cargo build --package server

image :
	-cp target/release/proxima docker
	-cp assets docker
	-cd $(DIR)/docker && docker build -f docker/Dockerfile -t dream-proxima:latest .

clean :
	-rm -f ./target