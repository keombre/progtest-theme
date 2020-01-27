build_dir := "build"
src_dir := "src"
out_dir := "out"

manifest_dir := "manifests"

key_file := "keys.txt"
api_key := $(shell head -n 1 ${key_file})
api_secret := $(shell tail -n 1 ${key_file})

all: chrome firefox

source: clean
	mkdir ${build_dir} 2>/dev/null || exit 0
	npx babel ${src_dir} --out-dir ${build_dir} --copy-files

firefox: source
	cp ${manifest_dir}/firefox.json ${build_dir}/manifest.json
	mkdir -p ${out_dir}/firefox || exit 0
	rm ${out_dir}/firefox/* || exit 0
	npx web-ext sign --channel=unlisted --api-key=${api_key} --api-secret=${api_secret} -s ${build_dir} -a ${out_dir}/firefox
	#npx web-ext build -s ${build_dir} -a ${out_dir}/firefox

chrome: source
	cp ${manifest_dir}/chrome.json ${build_dir}/manifest.json
	mkdir -p ${out_dir}/chrome || exit 0
	ln -s ${build_dir} progtest-themes
	rm ${out_dir}/chrome/* || exit 0
	find ./progtest-themes/ -type f | xargs zip ${out_dir}/chrome/progtest_themes.zip
	rm progtest-themes

dev: source
	cp ${manifest_dir}/chrome.json ${build_dir}/manifest.json

clean:
	rm -r ${build_dir}/* 2>/dev/null || exit 0
