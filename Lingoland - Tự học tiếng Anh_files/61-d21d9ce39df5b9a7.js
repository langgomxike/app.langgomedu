(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[61],{1210:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getDomainLocale=function(e,t,r,n){{let l=o(8875).normalizeLocalePath,a=o(8748).detectDomainLocale,i=t||l(e,r).detectedLocale,u=a(n,void 0,i);if(u){let t="http".concat(u.http?"":"s","://"),o=i===u.defaultLocale?"":"/".concat(i);return"".concat(t).concat(u.domain).concat("").concat(o).concat(e)}return!1}},("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},8045:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=o(6495).Z,n=o(2648).Z,l=o(1598).Z,a=o(7273).Z,i=l(o(7294)),u=n(o(5443)),c=o(2730),s=o(9309),f=o(9977);o(5086);var d=n(o(1479));let p={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function g(e){return void 0!==e.default}function h(e){return"number"==typeof e||void 0===e?e:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function m(e,t,o,n,l,a,i){if(!e||e["data-loaded-src"]===t)return;e["data-loaded-src"]=t;let u="decode"in e?e.decode():Promise.resolve();u.catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("blur"===o&&a(!0),null==n?void 0:n.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let o=!1,l=!1;n.current(r({},t,{nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>o,isPropagationStopped:()=>l,persist:()=>{},preventDefault:()=>{o=!0,t.preventDefault()},stopPropagation:()=>{l=!0,t.stopPropagation()}}))}(null==l?void 0:l.current)&&l.current(e)}})}let v=i.forwardRef((e,t)=>{var{imgAttributes:o,heightInt:n,widthInt:l,qualityInt:u,className:c,imgStyle:s,blurStyle:f,isLazy:d,fill:p,placeholder:g,loading:h,srcString:v,config:b,unoptimized:y,loader:w,onLoadRef:_,onLoadingCompleteRef:C,setBlurComplete:j,setShowAltText:E,onLoad:S,onError:M}=e,x=a(e,["imgAttributes","heightInt","widthInt","qualityInt","className","imgStyle","blurStyle","isLazy","fill","placeholder","loading","srcString","config","unoptimized","loader","onLoadRef","onLoadingCompleteRef","setBlurComplete","setShowAltText","onLoad","onError"]);return h=d?"lazy":h,i.default.createElement(i.default.Fragment,null,i.default.createElement("img",Object.assign({},x,{loading:h,width:l,height:n,decoding:"async","data-nimg":p?"fill":"1",className:c,style:r({},s,f)},o,{ref:i.useCallback(e=>{t&&("function"==typeof t?t(e):"object"==typeof t&&(t.current=e)),e&&(M&&(e.src=e.src),e.complete&&m(e,v,g,_,C,j,y))},[v,g,_,C,j,M,y,t]),onLoad:e=>{let t=e.currentTarget;m(t,v,g,_,C,j,y)},onError:e=>{E(!0),"blur"===g&&j(!0),M&&M(e)}})))}),b=i.forwardRef((e,t)=>{let o,n;var l,{src:m,sizes:b,unoptimized:y=!1,priority:w=!1,loading:_,className:C,quality:j,width:E,height:S,fill:M,style:x,onLoad:P,onLoadingComplete:O,placeholder:k="empty",blurDataURL:z,layout:L,objectFit:R,objectPosition:I,lazyBoundary:A,lazyRoot:T}=e,D=a(e,["src","sizes","unoptimized","priority","loading","className","quality","width","height","fill","style","onLoad","onLoadingComplete","placeholder","blurDataURL","layout","objectFit","objectPosition","lazyBoundary","lazyRoot"]);let N=i.useContext(f.ImageConfigContext),B=i.useMemo(()=>{let e=p||N||s.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),o=e.deviceSizes.sort((e,t)=>e-t);return r({},e,{allSizes:t,deviceSizes:o})},[N]),U=D,F=U.loader||d.default;delete U.loader;let W="__next_img_default"in F;if(W){if("custom"===B.loader)throw Error('Image with src "'.concat(m,'" is missing "loader" prop.')+"\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader")}else{let e=F;F=t=>{let{config:o}=t,r=a(t,["config"]);return e(r)}}if(L){"fill"===L&&(M=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[L];e&&(x=r({},x,e));let t={responsive:"100vw",fill:"100vw"}[L];t&&!b&&(b=t)}let Z="",q=h(E),G=h(S);if("object"==typeof(l=m)&&(g(l)||void 0!==l.src)){let e=g(m)?m.default:m;if(!e.src)throw Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ".concat(JSON.stringify(e)));if(!e.height||!e.width)throw Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ".concat(JSON.stringify(e)));if(o=e.blurWidth,n=e.blurHeight,z=z||e.blurDataURL,Z=e.src,!M){if(q||G){if(q&&!G){let t=q/e.width;G=Math.round(e.height*t)}else if(!q&&G){let t=G/e.height;q=Math.round(e.width*t)}}else q=e.width,G=e.height}}let H=!w&&("lazy"===_||void 0===_);((m="string"==typeof m?m:Z).startsWith("data:")||m.startsWith("blob:"))&&(y=!0,H=!1),B.unoptimized&&(y=!0),W&&m.endsWith(".svg")&&!B.dangerouslyAllowSVG&&(y=!0);let[K,V]=i.useState(!1),[J,Y]=i.useState(!1),$=h(j),Q=Object.assign(M?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:R,objectPosition:I}:{},J?{}:{color:"transparent"},x),X="blur"===k&&z&&!K?{backgroundSize:Q.objectFit||"cover",backgroundPosition:Q.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:'url("data:image/svg+xml;charset=utf-8,'.concat(c.getImageBlurSvg({widthInt:q,heightInt:G,blurWidth:o,blurHeight:n,blurDataURL:z,objectFit:Q.objectFit}),'")')}:{},ee=function(e){let{config:t,src:o,unoptimized:r,width:n,quality:l,sizes:a,loader:i}=e;if(r)return{src:o,srcSet:void 0,sizes:void 0};let{widths:u,kind:c}=function(e,t,o){let{deviceSizes:r,allSizes:n}=e;if(o){let e=/(^|\s)(1?\d?\d)vw/g,t=[];for(let r;r=e.exec(o);r)t.push(parseInt(r[2]));if(t.length){let e=.01*Math.min(...t);return{widths:n.filter(t=>t>=r[0]*e),kind:"w"}}return{widths:n,kind:"w"}}if("number"!=typeof t)return{widths:r,kind:"w"};let l=[...new Set([t,2*t].map(e=>n.find(t=>t>=e)||n[n.length-1]))];return{widths:l,kind:"x"}}(t,n,a),s=u.length-1;return{sizes:a||"w"!==c?a:"100vw",srcSet:u.map((e,r)=>"".concat(i({config:t,src:o,quality:l,width:e})," ").concat("w"===c?e:r+1).concat(c)).join(", "),src:i({config:t,src:o,quality:l,width:u[s]})}}({config:B,src:m,unoptimized:y,width:q,quality:$,sizes:b,loader:F}),et=m,eo={imageSrcSet:ee.srcSet,imageSizes:ee.sizes,crossOrigin:U.crossOrigin},er=i.useRef(P);i.useEffect(()=>{er.current=P},[P]);let en=i.useRef(O);i.useEffect(()=>{en.current=O},[O]);let el=r({isLazy:H,imgAttributes:ee,heightInt:G,widthInt:q,qualityInt:$,className:C,imgStyle:Q,blurStyle:X,loading:_,config:B,fill:M,unoptimized:y,placeholder:k,loader:F,srcString:et,onLoadRef:er,onLoadingCompleteRef:en,setBlurComplete:V,setShowAltText:Y},U);return i.default.createElement(i.default.Fragment,null,i.default.createElement(v,Object.assign({},el,{ref:t})),w?i.default.createElement(u.default,null,i.default.createElement("link",Object.assign({key:"__nimg-"+ee.src+ee.srcSet+ee.sizes,rel:"preload",as:"image",href:ee.srcSet?void 0:ee.src},eo))):null)});t.default=b,("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},8418:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=o(2648).Z,n=o(7273).Z,l=r(o(7294)),a=o(3297),i=o(4634),u=o(4611),c=o(3794),s=o(2725),f=o(3462),d=o(1018),p=o(7190),g=o(1210),h=o(8684);let m=new Set;function v(e,t,o,r,n){if(n||i.isLocalURL(t)){if(!r.bypassPrefetchedCheck){let n=void 0!==r.locale?r.locale:"locale"in e?e.locale:void 0,l=t+"%"+o+"%"+n;if(m.has(l))return;m.add(l)}Promise.resolve(e.prefetch(t,o,r)).catch(e=>{})}}function b(e){return"string"==typeof e?e:u.formatUrl(e)}let y=l.default.forwardRef(function(e,t){let o,r;let{href:u,as:m,children:y,prefetch:w,passHref:_,replace:C,shallow:j,scroll:E,locale:S,onClick:M,onMouseEnter:x,onTouchStart:P,legacyBehavior:O=!1}=e,k=n(e,["href","as","children","prefetch","passHref","replace","shallow","scroll","locale","onClick","onMouseEnter","onTouchStart","legacyBehavior"]);o=y,O&&("string"==typeof o||"number"==typeof o)&&(o=l.default.createElement("a",null,o));let z=!1!==w,L=l.default.useContext(f.RouterContext),R=l.default.useContext(d.AppRouterContext),I=null!=L?L:R,A=!L,{href:T,as:D}=l.default.useMemo(()=>{if(!L){let e=b(u);return{href:e,as:m?b(m):e}}let[e,t]=a.resolveHref(L,u,!0);return{href:e,as:m?a.resolveHref(L,m):t||e}},[L,u,m]),N=l.default.useRef(T),B=l.default.useRef(D);O&&(r=l.default.Children.only(o));let U=O?r&&"object"==typeof r&&r.ref:t,[F,W,Z]=p.useIntersection({rootMargin:"200px"}),q=l.default.useCallback(e=>{(B.current!==D||N.current!==T)&&(Z(),B.current=D,N.current=T),F(e),U&&("function"==typeof U?U(e):"object"==typeof U&&(U.current=e))},[D,U,T,Z,F]);l.default.useEffect(()=>{I&&W&&z&&v(I,T,D,{locale:S},A)},[D,T,W,S,z,null==L?void 0:L.locale,I,A]);let G={ref:q,onClick(e){O||"function"!=typeof M||M(e),O&&r.props&&"function"==typeof r.props.onClick&&r.props.onClick(e),I&&!e.defaultPrevented&&function(e,t,o,r,n,a,u,c,s,f){let{nodeName:d}=e.currentTarget,p="A"===d.toUpperCase();if(p&&(function(e){let t=e.currentTarget,o=t.getAttribute("target");return o&&"_self"!==o||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)||!s&&!i.isLocalURL(o)))return;e.preventDefault();let g=()=>{"beforePopState"in t?t[n?"replace":"push"](o,r,{shallow:a,locale:c,scroll:u}):t[n?"replace":"push"](r||o,{forceOptimisticNavigation:!f})};s?l.default.startTransition(g):g()}(e,I,T,D,C,j,E,S,A,z)},onMouseEnter(e){O||"function"!=typeof x||x(e),O&&r.props&&"function"==typeof r.props.onMouseEnter&&r.props.onMouseEnter(e),I&&(z||!A)&&v(I,T,D,{locale:S,priority:!0,bypassPrefetchedCheck:!0},A)},onTouchStart(e){O||"function"!=typeof P||P(e),O&&r.props&&"function"==typeof r.props.onTouchStart&&r.props.onTouchStart(e),I&&(z||!A)&&v(I,T,D,{locale:S,priority:!0,bypassPrefetchedCheck:!0},A)}};if(c.isAbsoluteUrl(D))G.href=D;else if(!O||_||"a"===r.type&&!("href"in r.props)){let e=void 0!==S?S:null==L?void 0:L.locale,t=(null==L?void 0:L.isLocaleDomain)&&g.getDomainLocale(D,e,null==L?void 0:L.locales,null==L?void 0:L.domainLocales);G.href=t||h.addBasePath(s.addLocale(D,e,null==L?void 0:L.defaultLocale))}return O?l.default.cloneElement(r,G):l.default.createElement("a",Object.assign({},k,G),o)});t.default=y,("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},8875:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.normalizeLocalePath=void 0;let r=(e,t)=>o(4317).normalizeLocalePath(e,t);t.normalizeLocalePath=r,("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},7190:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.useIntersection=function(e){let{rootRef:t,rootMargin:o,disabled:u}=e,c=u||!l,[s,f]=r.useState(!1),d=r.useRef(null),p=r.useCallback(e=>{d.current=e},[]);r.useEffect(()=>{if(l){if(c||s)return;let e=d.current;if(e&&e.tagName){let r=function(e,t,o){let{id:r,observer:n,elements:l}=function(e){let t;let o={root:e.root||null,margin:e.rootMargin||""},r=i.find(e=>e.root===o.root&&e.margin===o.margin);if(r&&(t=a.get(r)))return t;let n=new Map,l=new IntersectionObserver(e=>{e.forEach(e=>{let t=n.get(e.target),o=e.isIntersecting||e.intersectionRatio>0;t&&o&&t(o)})},e);return t={id:o,observer:l,elements:n},i.push(o),a.set(o,t),t}(o);return l.set(e,t),n.observe(e),function(){if(l.delete(e),n.unobserve(e),0===l.size){n.disconnect(),a.delete(r);let e=i.findIndex(e=>e.root===r.root&&e.margin===r.margin);e>-1&&i.splice(e,1)}}}(e,e=>e&&f(e),{root:null==t?void 0:t.current,rootMargin:o});return r}}else if(!s){let e=n.requestIdleCallback(()=>f(!0));return()=>n.cancelIdleCallback(e)}},[c,o,t,s,d.current]);let g=r.useCallback(()=>{f(!1)},[]);return[p,s,g]};var r=o(7294),n=o(9311);let l="function"==typeof IntersectionObserver,a=new Map,i=[];("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},2730:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getImageBlurSvg=function(e){let{widthInt:t,heightInt:o,blurWidth:r,blurHeight:n,blurDataURL:l,objectFit:a}=e,i=r||t,u=n||o,c=l.startsWith("data:image/jpeg")?"%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='1 1'/%3E%3C/feComponentTransfer%3E%":"";return i&&u?"%3Csvg xmlns='http%3A//www.w3.org/2000/svg' viewBox='0 0 ".concat(i," ").concat(u,"'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='").concat(r&&n?"1":"20","'/%3E").concat(c,"%3C/filter%3E%3Cimage preserveAspectRatio='none' filter='url(%23b)' x='0' y='0' height='100%25' width='100%25' href='").concat(l,"'/%3E%3C/svg%3E"):"%3Csvg xmlns='http%3A//www.w3.org/2000/svg'%3E%3Cimage style='filter:blur(20px)' preserveAspectRatio='".concat("contain"===a?"xMidYMid":"cover"===a?"xMidYMid slice":"none","' x='0' y='0' height='100%25' width='100%25' href='").concat(l,"'/%3E%3C/svg%3E")}},1479:function(e,t){"use strict";function o(e){let{config:t,src:o,width:r,quality:n}=e;return"".concat(t.path,"?url=").concat(encodeURIComponent(o),"&w=").concat(r,"&q=").concat(n||75)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,o.__next_img_default=!0,t.default=o},5675:function(e,t,o){e.exports=o(8045)},1664:function(e,t,o){e.exports=o(8418)}}]);