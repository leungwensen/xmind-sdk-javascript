# grouped tasks
make:
	make install
	make test
all:
	make preinstall
	make
	make publish

# tasks
preinstall:
	npm  install -g cnpm --registry=https://registry.npmmirror.com
install:
	cnpm install
	npm install
test:
publish:
	npm publish
	cnpm sync xmind
