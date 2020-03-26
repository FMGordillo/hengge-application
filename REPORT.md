# REPORT

## Overall

My background is 90% technical and 10% business needs, with poor skills in design (color theory, hierachy and other concepts I am familiar with and never implemented it).

I've made several mistakes regarding to the organization of styles:

- No clear organization of responsability (_where should I put the css?_, _inline styles?_, _it's all bundled together_).
- No sub division of components
- No testing implemented

To be really honest, I could keep going on the organization but I was very anxious and worried of not being able to make it to the interview (might be a lot of competition out there).

## Architectural decisions

- This mockup is based on [**`Preact`**](https://github.com/preactjs/preact) for the sake of simplicity in bundle size and to try out new things (i've never done a formal app with this library).
- With the same philosophy of low bundle size, also installed [**`date-fns`**](https://github.com/date-fns/date-fns) specially for those date calculations (_is this date in-between the range given?_)
- I've implemented an in-memory DB [**`lowdb`**](https://github.com/typicode/lowdb) as a mockup to easily extend it into a real app.

## Regarding Mission 1

I couldn't replicate the visual capability of a search bar using two date ranges. I've tried using libraries but they were exceeding the gzip size of the entire bundle (> **`500kb`**), so I took a decision to leave it out behind and keep it perfonmant.

## Regarding Mission 2

Related to the assignment _`the extended design should allow user to inspect multiple email bodies at once`_ I assumed that is referred to the mail chain, but I had no clue in design and I wasn't feeling comfortable doing it without a design guidance.
