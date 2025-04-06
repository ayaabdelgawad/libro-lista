# Libro Lista
Libro Lista is a platform for bookworms. Users can create and follow “Listas,” the reading list equivalent of a Pinterest board. Each Lista contains books, each with potentially multiple reviews. When a reader reviews a book, they can also add tags (such as “Latino author,” “would read again,” or “psychological thriller”). The result is a fun, creative platform for bookworms.


## Generating the Database
This project uses MySQL to store data. The database generation script is located in `database/generate-db.sql`. To run the script, you can do

```
mysql -u <user> -p < database/generate-db.sql
```
This will prompt you for the MySQL user's password and then run the script file. If the user has no password, omit the `-p` flag.

There is also a pre-population script that will allow you to populate the database with some authors and books. To run it, do
```
mysql -u <user> -p < database/populate-db.sql
```

## Starting up the Backend Server
The backend runs on Python. To install the necessary packages, run
```
pip install -r backend/requirements.txt
```
To start up the backend in dev mode, run
```
FLASK_APP=server.py FLASK_ENV=development flask run
```

## Starting the Frontend

The frontend is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
