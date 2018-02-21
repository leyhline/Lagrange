# Notes on [Jekyll](https://jekyllrb.com/)

I'm currently browsing the [Jekyll documentation](https://jekyllrb.com/docs/) to get a better understanding of its workings and to fix some little annoyances. This file is noting some short reminders of some useful functionality I would otherwise forget.

# [Directory structure](https://jekyllrb.com/docs/structure/)

* **`_drafts`** Unpublished posts; `title.md`
* **`_includes`** Partials to include in layouts or posts `_includes/file.ext` ↔ `{% include file.ext %}` 
* **`_layouts`** Post layouts, interject content with `{{ content }}`
* **`_posts`** Naming: `YEAR-MONTH-DAY-title.md`
* **`_data`** Site data in `.yml` or `.json`; accessible via `site.data.filename`
* **`_sass`** partials for main.scss (look into Sass later)