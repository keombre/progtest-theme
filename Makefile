out := "progtest-themes.zip"

current_dir := $(notdir $(shell pwd))

clean:
	rm ../${out} 2>/dev/null || exit 0

zip: clean
	cd .. &&\
	find ./${current_dir} -type f \
	  ! -path "./${current_dir}/.*"\
	  ! -path "./${current_dir}/Makefile"\
	  ! -path "./${current_dir}/manifest.debug.json"\
	  ! -path "./${current_dir}/LICENSE"\
	| xargs zip ${out} $1
