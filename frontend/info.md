### Inspiration

React query + server actions
https://www.youtube.com/watch?v=OgVeQVXt7xU
https://nextjs.org/docs/app/building-your-application/authentication

### Generics

convertToArray = <T>(input: T)V

### Layouts
Only what is changed will be re rendered
Partial Rerenders
https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering

### Automatic code-splitting
https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works
Splitting code by routes so
if error is in one place whole site wont chrash

### Waterfall
will leed to performance gains,, can be issue if one is slower than others

const {
  numberOfInvoices,
  numberOfCustomers,
  totalPaidInvoices,
  totalPendingInvoices,
} = await fetchCardData();

inside fetachCardData we do, to do paralel fetching:

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);


### What is Static Rendering?

With static rendering, data fetching and rendering happens on the server at build time (when you deploy) or when revalidating data.

Whenever a user visits your application, the cached result is served. There are a couple of benefits of static rendering:

    Faster Websites - Prerendered content can be cached and globally distributed. This ensures that users around the world can access your website's content more quickly and reliably.
    Reduced Server Load - Because the content is cached, your server does not have to dynamically generate content for each user request.
    SEO - Prerendered content is easier for search engine crawlers to index, as the content is already available when the page loads. This can lead to improved search engine rankings.

Static rendering is useful for UI with no data or data that is shared across users, such as a static blog post or a product page. It might not be a good fit for a dashboard that has personalized data which is regularly updated.

The opposite of static rendering is dynamic rendering.ing, data fetching and rendering happens on the server at build time (when you deploy) or when revalidating data.

### What is Dynamic Rendering?
With dynamic rendering, your application is only as fast as your slowest data fetch.!!!!!!!!!!!!!!
With dynamic rendering, content is rendered on the server for each user at request time (when the user visits the page). There are a couple of benefits of dynamic rendering:
    Real-Time Data - Dynamic rendering allows your application to display real-time or frequently updated data. This is ideal for applications where data changes often.
    User-Specific Content - It's easier to serve personalized content, such as dashboards or user profiles, and update the data based on user interaction.
    Request Time Information - Dynamic rendering allows you to access information that can only be known at request time, such as cookies or the URL search parameters.
### What is streaming?
Streaming is a data transfer technique that allows you to break down a route into smaller "chunks" and progressively stream them from the server to the client as they become ready.
Diagram showing time with sequential data fetching and parallel data fetching
By streaming, you can prevent slow data requests from blocking your whole page. This allows the user to see and interact with parts of the page without waiting for all the data to load before any UI can be shown to the user.
Streaming works well with React's component model, as each component can be considered a chunk.
There are two ways you implement streaming in Next.js:
    At the page level, with the loading.tsx file.
    For specific components, with <Suspense>.
Let's see how this works.
### ROute groups
(overview)
will only do loading on dashboard page  
https://nextjs.org/docs/app/building-your-application/routing/route-groups
### Icons
https://heroicons.com/
### Partial Prerendering
combine sstatic and dynamic rendering
const nextConfig = {
  experimental: {
    ppr: 'incremental',
  },
};
### These are the Next.js client hooks that you'll use to implement the search functionality:
useSearchParams- Allows you to access the parameters of the current URL. For example, the search params for this URL /dashboard/invoices?page=1&query=pending would look like this: {page: '1', query: 'pending'}.
usePathname - Lets you read the current URL's pathname. For example, for the route /dashboard/invoices, usePathname would return '/dashboard/invoices'.
useRouter - Enables navigation between routes within client components programmatically. There are multiple methods you can use.
### Debouncing 
is a programming practice that limits the rate at which a function can fire. In our case, you only want to query the database when the user has stopped typing.
How Debouncing Works:
Trigger Event: When an event that should be debounced (like a keystroke in the search box) occurs, a timer starts.
Wait: If a new event occurs before the timer expires, the timer is reset.
Execution: If the timer reaches the end of its countdown, the debounced function is executed.
### Next.js with Server Actions
Server Actions are also deeply integrated with Next.js caching
. When a form is submitted through a Server Action, not only can you use the action to mutate data, but you can also revalidate the associated cache using APIs like revalidatePath and revalidateTag.

### use client/server

Without the 'use client' directive, the framework might attempt to treat it as a Server Component. This would lead to runtime errors or a non-functional component when used in client-side interactive contexts.
