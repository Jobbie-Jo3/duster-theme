#SALT 2-Man Points catalogue preview

Changes:
- Vercel homepage: 2-Man selection shows a read-only list of Tip4Serv 2-Man Points packs.
- Uses only_enabled=false; whether Tip4Serv returns disabled products is unverified.
- Existing /shop displays the 6-Man shop and hides product names labelled 2-Man, 4-Man, or Duos.
- 6-Man shop gets a Switch Cluster link.
- No new add-to-cart or checkout actions were introduced for the 2-Man preview.

IMPORTANT:
- This is a display-only test, NOT a secure full multi-cluster checkout isolation implementation.
- Do not enable 2-Man products for sale yet. Existing product detail routes, cart, and checkout must be audited and enforced server-side before launch.
- Name filtering is temporary; replace it with explicit Tip4Serv product-ID allowlists after obtaining IDs.
- The API may omit disabled products despite only_enabled=false.
- Work on the three-cluster-shop branch; do not merge into production before testing.
