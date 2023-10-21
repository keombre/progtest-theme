# Development

This is a database of all the information about developing the extension I can think of.

## Test Pages

When developing, you can place the HTML files gathered from issues into `test_pages/`.

The folder structure follows the search params of the URL, e.g. `?X=Course&Cou=123` maps to `test_pages/course/123.html`.

-   `?X=[folder_name]`
    -   `?Cou=[file_name]`

The file can optionally include a comment in the first line describing what the page is.

```html
<!-- BI-PA2 Homework 4 -->
...the rest of the file
```

Then, when running `bun dev`, if you add the `ptmock.localhost 127.0.0.1` entry into your `/etc/hosts`, you can visit `http://ptmock.localhost:3000/`, which will contain a list of all the test pages with their comments. If you open one of them, the URL and the page should be the same as if you went to Progtest.
