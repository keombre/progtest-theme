build_dir := "build"
source_name := "progtest-theme.tar.gz"
current_dir := $(notdir $(shell pwd))
key_file := "keys.txt"
api_key := $(shell head -n 1 ${key_file})
api_secret := $(shell tail -n 1 ${key_file})

zip: clean
	mkdir ${build_dir} 2>/dev/null || exit 0

	# Copy files and folders separately so that
	# find + cp doesn't stash all files to the same folder
	
	# 1. Find and copy all files inside the main folder
	find ./ -maxdepth 1 -type f \
	  ! -path "./.*"\
	  ! -path "./Makefile"\
	  ! -path "./manifest.debug.json"\
	  ! -path "./manifest.chrome.json"\
	  ! -path "./manifest.firefox.json"\
	  ! -path "./*lock*"\
	  ! -path "./package.json"\
	  ! -path "./LICENSE"\
	  ! -path "./keys.txt"\
	  ! -path "./update.json"\
	| xargs -I file cp file ${build_dir}

	# 2. Find and copy all folders inside the main folder
	find ./ -maxdepth 1 -type d \
	  ! -path "./node_modules"\
	  ! -path "./${build_dir}"\
	  ! -path "./web-ext-artifacts"\
	  ! -path "./.*"\
	  ! -path "./"\
	| xargs -I file cp -r file ${build_dir}

	# Transpile all files with babel
	# Note: the original copied files will be overwritten
	find ./ -name "*[^pack].js"\
	 ! -path "./node_modules/*"\
	 ! -path "./${build_dir}/*"\
	| xargs -I file npx babel file -o ./${build_dir}/file

firefox: zip
	cp manifest.firefox.json ${build_dir}/manifest.json
	# Build the extension zip with web-ext
	npx web-ext sign --channel=unlisted --api-key=${api_key} --api-secret=${api_secret} -s ${build_dir}

chrome: zip
	cp manifest.chrome.json ${build_dir}/manifest.json
	mkdir web-ext-artifacts || exit 0
	ln -s ${build_dir} progtest-themes
	find ./progtest-themes/ -type f | xargs zip web-ext-artifacts/progtest_themes-chrome.zip $1
	rm progtest-themes

source: clean_source
	cd .. &&\
	tar -zcvf ${source_name}\
	 --exclude './${current_dir}/node_modules'\
	 --exclude './${current_dir}/build'\
	 --exclude './${current_dir}/web-ext-artifacts'\
	 --exclude='.[^(babelrc)/]*'\
	 ./${current_dir}

clean:
	yes |rm -r ${build_dir}/* 2>/dev/null || exit 0
	rm web-ext-artifacts/progtest_themes-* 2>/dev/null || exit 0

clean_source:
	rm ../${source_name} || exit 0