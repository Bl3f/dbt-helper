[<img src="https://user-images.githubusercontent.com/2658211/183131703-7d866068-c832-4b10-aa63-66130af63ea7.png">](https://addons.mozilla.org/en-GB/firefox/addon/dbt-helper/)

# dbt-helper
This is the web extension that empowers all dbt users.

If you are a data analyst, an analytics engineer or a data engineer using dbt you already experienced the pain dbt is when it comes to switch between your warehouse SQL editor and your dbt git repository where the code lies.

This extension aims to fix all the flaws in your workflow. Thanks to dbt-helper you'll be able to directly template your SQL queries from your browser while copy/pasting the data.

## Demo

https://user-images.githubusercontent.com/2658211/183826696-4a8240d2-912d-4448-a853-41f6d6793b8b.mov

## Examples

If you have a query like
```sql
SELECT count(*)
FROM gcs.posts
```

With the extension installed, each time you will copy this text it'll be transformed as below
```sql
SELECT count(*)
FROM {{ source('gcs', 'posts') }}
```

## How it works
You need to provide your dbt `manifest.json` (but it stays locally in your browser) and from this it knows what are your models and sources. By using a regular expression all the FROM and JOIN will be matched and replaced by the correct dbt syntax. Saving you precious time.
