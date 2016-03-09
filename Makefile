make:
	make browser

browser:
	./node_modules/.bin/browserify  ./index-browser.js       >  ./dist/xmind-browser.js
	./node_modules/.bin/uglifyjs    ./dist/xmind-browser.js  >  ./dist/xmind-browser.min.js
