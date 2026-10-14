# #SALT Three-Cluster Shop — setup notes

- `/shop` is now the cluster selector; `/shop/6man` is the **original unmodified catalogue/checkout logic**.
- `/shop/2man` and `/shop/4man` are deliberately **preview-only** until separate Tip4Serv product IDs and their correct delivery targets have been configured.
- The existing Tip4Serv store and environment variables are unchanged.
- **Do not activate Duos or 4-Man purchases** before verifying that each product delivers only to the intended cluster/database.
- When configuring new products, record the Tip4Serv product IDs and RCON delivery targets, and test delivery separately on each test server.
- This update does **not** implement cross-cluster cart separation; only the 6-Man catalogue can currently add items to the cart.
- Deploy to a Vercel preview branch first; confirm current 6-Man product, cart and checkout behavior before merging to master.
