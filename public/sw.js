if(!self.define){let e,s={};const i=(i,a)=>(i=new URL(i+".js",a).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(a,c)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const r=e=>i(e,n),f={module:{uri:n},exports:t,require:r};s[n]=Promise.all(a.map((e=>f[e]||r(e)))).then((e=>(c(...e),t)))}}define(["./workbox-7c2a5a06"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"2c9d4622dc57d7cdcf902654474b1c6f"},{url:"/_next/static/_ezKCQifI3McSOAKbshf5/_buildManifest.js",revision:"9262961651e0d7fa108aef74f09893fc"},{url:"/_next/static/_ezKCQifI3McSOAKbshf5/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/2443530c-f0da4d10b62e6993.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/313-2f629b560dac5265.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/368-0c5307c920814b59.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/488-8392fc7948a81217.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/5c65a573-b9a7904ab7478fe7.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/645-8b70f226c195ecfe.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/740-d6be240f0e6483c4.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/751-25d4028f4732c43b.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/920-9d99943bc4cd94fb.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/app/app/friends/page-788acd8e3cb945ed.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/app/app/layout-2ea24ca02884d164.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/app/app/page-5d9ac42800d47210.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/app/app/profile/error-74fd09a66eb43b64.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/app/app/profile/page-5f7a48b392a4199b.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/app/app/profile/settings/page-93e0586dd3178233.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/app/app/upload/page-d07a83801944a390.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/app/app/users/%5Buid%5D/page-635fbbd51dd80f86.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/app/layout-43e299794a78b00b.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/app/page-27c6c28f0ecc4e92.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/framework-8883d1e9be70c3da.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/main-app-4e565c4b588fcc6e.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/main-e0ccda27af2c96fe.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/pages/_app-b555d5e1eab47959.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/pages/_error-d79168f986538ac0.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-cb5e77d68e93a83d.js",revision:"_ezKCQifI3McSOAKbshf5"},{url:"/_next/static/css/5fa38944c0b50687.css",revision:"5fa38944c0b50687"},{url:"/_next/static/css/af6143d357d0159b.css",revision:"af6143d357d0159b"},{url:"/_next/static/media/2aaf0723e720e8b9-s.p.woff2",revision:"e1b9f0ecaaebb12c93064cd3c406f82b"},{url:"/_next/static/media/9c4f34569c9b36ca-s.woff2",revision:"2c1fc211bf5cca7ae7e7396dc9e4c824"},{url:"/_next/static/media/addFriend.c4fe113e.svg",revision:"622cc8266377273cd961501b21f32598"},{url:"/_next/static/media/ae9ae6716d4f8bf8-s.woff2",revision:"b0c49a041e15bdbca22833f1ed5cfb19"},{url:"/_next/static/media/b1db3e28af9ef94a-s.woff2",revision:"70afeea69c7f52ffccde29e1ea470838"},{url:"/_next/static/media/b967158bc7d7a9fb-s.woff2",revision:"08ccb2a3cfc83cf18d4a3ec64dd7c11b"},{url:"/_next/static/media/backArrow.aa049b19.svg",revision:"6f4997730c4fd9f86287515d0e518192"},{url:"/_next/static/media/c0f5ec5bbf5913b7-s.woff2",revision:"8ca5bc1cd1579933b73e51ec9354eec9"},{url:"/_next/static/media/check.51c28ea4.svg",revision:"aecb1c0bdb4735c02d611ffe098b16e4"},{url:"/_next/static/media/closeIcon.1b15e180.svg",revision:"aac98fef71fae2d0d9943e3c8ce2ed99"},{url:"/_next/static/media/d1d9458b69004127-s.woff2",revision:"9885d5da3e4dfffab0b4b1f4a259ca27"},{url:"/_next/static/media/lock.40a7ed9d.svg",revision:"0e953456b1f69131621147f9e20c1a40"},{url:"/_next/static/media/paperPlane.bcda094e.svg",revision:"8891f7579c308017129819cd5c79c18b"},{url:"/_next/static/media/people.ecd8d258.svg",revision:"54511730415a4873a820e31b1c175f48"},{url:"/_next/static/media/profile.86d50c26.svg",revision:"d71420e180d520462b084c6ad7a69939"},{url:"/_next/static/media/rotate.4bc57ae1.svg",revision:"3bfa82923d2552f4b19d1dc85d5dbf4a"},{url:"/_next/static/media/share.9113f8ee.svg",revision:"1c9233dd3358684670adab2e98ddee50"},{url:"/_next/static/media/verticalDots.5171ff93.svg",revision:"d0f92a0ca0438659db5973b14a414f61"},{url:"/assets/addFriend.svg",revision:"622cc8266377273cd961501b21f32598"},{url:"/assets/backArrow.svg",revision:"6f4997730c4fd9f86287515d0e518192"},{url:"/assets/check.svg",revision:"aecb1c0bdb4735c02d611ffe098b16e4"},{url:"/assets/closeIcon.svg",revision:"aac98fef71fae2d0d9943e3c8ce2ed99"},{url:"/assets/lock.svg",revision:"0e953456b1f69131621147f9e20c1a40"},{url:"/assets/openInNew.svg",revision:"2e21bff8b3716586c470e0c3afff6b1e"},{url:"/assets/paperPlane.svg",revision:"8891f7579c308017129819cd5c79c18b"},{url:"/assets/people.svg",revision:"54511730415a4873a820e31b1c175f48"},{url:"/assets/profile.svg",revision:"d71420e180d520462b084c6ad7a69939"},{url:"/assets/rotate.svg",revision:"3bfa82923d2552f4b19d1dc85d5dbf4a"},{url:"/assets/share.svg",revision:"1c9233dd3358684670adab2e98ddee50"},{url:"/assets/verticalDots.svg",revision:"d0f92a0ca0438659db5973b14a414f61"},{url:"/logo/icon-192x192.png",revision:"9b64fb3adb8bc031ad50711e03c11f5e"},{url:"/logo/icon-256x256.png",revision:"49e0a2728bf392b91f0e806ccc35e3d3"},{url:"/logo/icon-384x384.png",revision:"768f54a1548ce32f7d8dabe2b19e6544"},{url:"/logo/icon-512x512.png",revision:"5ad684a4dfca15e3737a6ab6579bd177"},{url:"/logo/logo.png",revision:"54f2f7a915d818ba193605b1f7446322"},{url:"/logo/logo.svg",revision:"b0b50ec32309156177e657b01085ab93"},{url:"/manifest.json",revision:"b846e3f0427392e55d98b99eef3a59cd"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:i,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));