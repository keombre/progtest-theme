build_dir := "build"

zip: clean
	mkdir ${build_dir} 2>/dev/null || exit 0

	# Copy files and folders separately so that
	# find + cp doesn't stash all files to the same folder
	
	# 1. Find and copy all files inside the main folder
	find ./ -maxdepth 1 -type f \
	  ! -path "./.*"\
	  ! -path "./Makefile"\
	  ! -path "./manifest.debug.json"\
	  ! -path "./*lock*"\
	  ! -path "./package.json"\
	  ! -path "./LICENSE"\
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

	# Build the extension zip with web-ext
	npx web-ext build -s ${build_dir}

clean:
	yes |rm -r ${build_dir} 2>/dev/null || exit 0
	rm web-ext-artifacts/progtest_themes-* 2>/dev/null || exit 0
