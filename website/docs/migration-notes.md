# Website Refactor Notes

- Legacy snapshot pages added and integrated from `website/legacy/snapshot/`.
- Mapped gallery pages to property codes:
  - Gallery 1 -> P-220
  - Gallery 2 -> P-1888
  - Gallery 3 -> P-210
  - Gallery 4 -> P-1703
  - Gallery 6 -> P-4108
- Normalized gallery assets now live in `website/assets/images/properties/<CODE>/` as `g01`, `g02`, etc.
- About content was migrated into `website/about/index.html`.
- No separate legacy gallery was found for P-302, so that page keeps the main hero image only.
