#SALT Three-Cluster Shop Preview

/shop is now the cluster selector.
/shop/6man contains the unchanged original /shop catalogue.
/shop/2man and /shop/4man are disabled placeholder pages (no checkout).
Original Tip4Serv APIs, cart and checkout remain unchanged.

IMPORTANT: The home page still contains its original featured products grid; these are existing 6-Man products. Remove or re-label separately if desired before launching multiple live clusters.

To deploy: upload the CONTENTS of the duster-theme-master folder to the root of the GitHub three-cluster-shop branch (not a nested folder). Verify app/shop/page.tsx contains Choose Your Cluster. Test the preview /shop URL.

Before enabling Duos or 4-Man: set up distinct Tip4Serv products and verify each delivery target. Never reuse 6-Man product IDs for other clusters.
