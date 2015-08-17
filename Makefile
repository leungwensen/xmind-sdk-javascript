make:
	make browser

browser:
	browserify ./index-browser.js > dist/xmind-browser.js
	uglifyjs dist/xmind-browser.js > dist/xmind-browser.min.js
