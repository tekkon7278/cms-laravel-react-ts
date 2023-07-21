<!DOCTYPE html>
<html>
  <head>
    @viteReactRefresh
    @vite([
      'resources/ts/app.tsx'
    ])
    <title>{{ $page->title() }}</title>
  </head>
  <body>
    <div
      id="app"
      data-site-id="{{ $page->siteId() }}"
      data-page-id="{{ $page->id() }}"
    ></div>
  </body>
</html>