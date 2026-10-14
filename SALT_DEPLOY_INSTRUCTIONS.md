# #SALT Three-Cluster Vercel Shop

This ZIP contains the **full Next.js project**, not just a patch. Upload the **contents of `duster-theme-master`** to the root of the `three-cluster-shop` GitHub branch (do not upload a nested `duster-theme-master` folder).

- `/` is now the cluster selector on first visit. A returning visitor is redirected to their last chosen cluster using browser localStorage.
- `/shop` is **always** the selector for manual switching.
- Every cluster page shows a **Switch Cluster** link.
- `/shop/6man` retains the existing catalogue and checkout logic.
- `/shop/2man` and `/shop/4man` are non-purchasable placeholders until separate Tip4Serv product IDs and delivery are tested.
- Netlify main website does not need changes if its Shop button already links to the Vercel root.

After committing to the preview branch, check the **new** Vercel deployment URL (not an older deployment URL). Test in a private/incognito window for first visit, then select 6-Man and reload `/` to verify remembering. Switching via `/shop` updates the remembered selection.

No production deployment or payment test has been performed here.
