# nitwitt

blocks twitter and redirects it to nitter.
works on embed as well.

## dependencies

tailwindcss is not currently used really...

```json
{
  "dependencies": {
    "react": "^18.1.0",
    "react-dom": "^18.1.0"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.2",
    "@types/chrome": "^0.0.184",
    "@types/react": "^18.0.8",
    "@types/react-dom": "^18.0.3",
    "@types/webpack": "^5.28.0",
    "copy-webpack-plugin": "^10.2.4",
    "css-loader": "^6.7.1",
    "html-webpack-plugin": "^5.5.0",
    "tailwindcss": "^3.0.24",
    "terser-webpack-plugin": "^5.3.1",
    "ts-loader": "^9.3.0",
    "typescript": "^4.6.4",
    "webpack": "^5.72.0",
    "webpack-cli": "^4.9.2"
  }
}
```

also requires `7zip` for zipping release file automatically.

## build instructions

```bash
npm run build  # for debug
npm run release  # for release build
```

