# TODO:

- Integrate Lulu API
  https://developers.lulu.com/home

- cheeky description of unplugged books
- title page
- copyright?

## Twitter

- Twitter only returns 3200 at a time
- Books will have to be limited in scope for now
- the 3,200 limit is for browsing the timeline only. Tweets can always be requested by their ID using the GET statuses/show/:id method

# Book Design

Notes:

- 0.125 in bleed safety factor
- 6 x 9 in book requires a PDF with pages sized 6.25 x 9.25 in to meet Full Bleed print requirements

#### Paperback Covers

`spine width (in) = (numInteriorPages / 444) + 0.06 in`

- Digest: 5.5" by 8.5" (528px x 816px)
- Excellent Image Quality (3400 x 2200 pixels)

Target interior pages: 100
Spine width (n=100): 0.28522522522 in. (28px)

- Cover dimensions:
  (528px + 28px) x 816 px = 556px x 816px (1668px x 2448px)
