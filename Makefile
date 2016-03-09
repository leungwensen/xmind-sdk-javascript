make:
	make browser
all:
	make browser
	make publish

browser:
	./node_modules/.bin/browserify  ./index-browser.js       >  ./dist/xmind-browser.js
	./node_modules/.bin/uglifyjs    ./dist/xmind-browser.js  >  ./dist/xmind-browser.min.js

publish:
	npm publish xmind && cnpm sync xmind
