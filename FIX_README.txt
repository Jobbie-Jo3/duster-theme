#SALT 2-Man build fix

This version does NOT navigate to /shop/2man (which is not an existing Next.js route).
Instead, app/page.tsx renders TwoManPointsPreview directly for 2-Man.

Includes components/shop/two-man-points-preview.tsx to fetch disabled Tip4Serv products for display-only preview.
6-Man keeps /shop. 4-Man stays placeholder. Checkout is not enabled for 2-Man.

Upload extracted files to the three-cluster-shop branch, ensuring app/page.tsx and components/shop/two-man-points-preview.tsx both land at the repo root paths.
