import{t as e}from"./rolldown-runtime.TjgygFMs.mjs";import{A as t,E as n,F as r,L as i,M as a,N as o,V as s,b as c,d as l,f as u,l as d,v as ee,z as f}from"./react.DmPkVhLV.mjs";import{C as p,a as m,r as h,t as g}from"./motion.ehSPkjjk.mjs";import{B as _,M as v,O as y,a as te,bt as b,ct as ne,ft as x,i as re,it as ie,k as S,o as C,pt as w,q as T,st as ae,u as E,ut as D}from"./framer.QbcCWnu2.mjs";import{S as O,b as k,o as oe,t as se}from"./OIjZRBmWDcIE2B6qgG1j.Chut4pT3.mjs";import{n as ce,r as le}from"./NvHzbSRq3.lvkjSmGj.mjs";var ue=e((()=>{se()}));function A({type:e,url:t,html:n,zoom:r,radius:i,border:a,style:o={}}){return e===`url`&&t?l(fe,{url:t,zoom:r,radius:i,border:a,style:o}):e===`html`&&n?l(M,{html:n,style:o}):l(de,{style:o})}function de({style:e}){return l(`div`,{style:{minHeight:z(e),...O,overflow:`hidden`,...e},children:l(`div`,{style:H,children:`To embed a website or widget, add it to the properties\xA0panel.`})})}function fe({url:e,zoom:t,radius:n,border:a,style:o}){let s=!o.height;/[a-z]+:\/\//.test(e)||(e=`https://`+e);let c=oe(),[u,d]=i(c?void 0:!1);return r(()=>{if(!c)return;let t=!0;d(void 0);async function n(){let n=await fetch(`https://api.framer.com/functions/check-iframe-url?url=`+encodeURIComponent(e));if(n.status==200){let{isBlocked:e}=await n.json();t&&d(e)}else{let e=await n.text();console.error(e),d(Error(`This site can’t be reached.`))}}return n().catch(e=>{console.error(e),d(e)}),()=>{t=!1}},[e]),c&&s?l(R,{message:`URL embeds do not support auto height.`,style:o}):e.startsWith(`https://`)?u===void 0?l(L,{}):u instanceof Error?l(R,{message:u.message,style:o}):u===!0?l(R,{message:`Can’t embed ${e} due to its content security policy.`,style:o}):l(`iframe`,{src:e,style:{...B,...o,...a,zoom:t,borderRadius:n,transformOrigin:`top center`},loading:`lazy`,fetchPriority:c?`low`:`auto`,referrerPolicy:`no-referrer`,sandbox:j(c),allowFullScreen:!0,allow:`presentation; fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; clipboard-write`}):l(R,{message:`Unsupported protocol.`,style:o})}function j(e){let t=[`allow-same-origin`,`allow-scripts`];return e||t.push(`allow-downloads`,`allow-forms`,`allow-modals`,`allow-orientation-lock`,`allow-pointer-lock`,`allow-popups`,`allow-popups-to-escape-sandbox`,`allow-presentation`,`allow-storage-access-by-user-activation`,`allow-top-navigation-by-user-activation`),t.join(` `)}function M({html:e,...t}){if(e.includes(`<\/script>`)){let n=e.includes(`</spline-viewer>`),r=e.includes(`<!-- framer-direct-embed -->`);return l(n||r?P:N,{html:e,...t})}return l(F,{html:e,...t})}function N({html:e,style:n}){let a=t(),[o,c]=i(0);r(()=>{let e=a.current?.contentWindow;function t(t){if(t.source!==e)return;let n=t.data;if(typeof n!=`object`||!n)return;let r=n.embedHeight;typeof r==`number`&&c(r)}return s.addEventListener(`message`,t),e?.postMessage(`getEmbedHeight`,`*`),()=>{s.removeEventListener(`message`,t)}},[]);let u=`
<html>
    <head>
        <style>
            html, body {
                margin: 0;
                padding: 0;
            }

            body {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            :root {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            * {
                box-sizing: border-box;
                -webkit-font-smoothing: inherit;
            }

            h1, h2, h3, h4, h5, h6, p, figure {
                margin: 0;
            }

            body, input, textarea, select, button {
                font-size: 12px;
                font-family: sans-serif;
            }
        </style>
    </head>
    <body>
        ${e}
        <script type="module">
            let height = 0

            function sendEmbedHeight() {
                window.parent.postMessage({
                    embedHeight: height
                }, "*")
            }

            const observer = new ResizeObserver((entries) => {
                if (entries.length !== 1) return
                const entry = entries[0]
                if (entry.target !== document.body) return

                height = entry.contentRect.height
                sendEmbedHeight()
            })

            observer.observe(document.body)

            window.addEventListener("message", (event) => {
                if (event.source !== window.parent) return
                if (event.data !== "getEmbedHeight") return
                sendEmbedHeight()
            })
        <\/script>
    <body>
</html>
`,d={...B,...n};return n.height||(d.height=o+`px`),l(`iframe`,{ref:a,style:d,srcDoc:u})}function P({html:e,style:n}){let i=t();return r(()=>{let t=i.current;if(t)return t.innerHTML=e,I(t),()=>{t.innerHTML=``}},[e]),l(`div`,{ref:i,style:{...V,...n}})}function F({html:e,style:t}){return l(`div`,{style:{...V,...t},dangerouslySetInnerHTML:{__html:e}})}function I(e){if(e instanceof Element&&e.tagName===`SCRIPT`){let t=document.createElement(`script`);t.text=e.innerHTML;for(let{name:n,value:r}of e.attributes)t.setAttribute(n,r);e.parentElement.replaceChild(t,e)}else for(let t of e.childNodes)I(t)}function L(){return l(`div`,{className:`framerInternalUI-componentPlaceholder`,style:{...k,overflow:`hidden`},children:l(`div`,{style:H,children:`Loading…`})})}function R({message:e,style:t}){return l(`div`,{className:`framerInternalUI-errorPlaceholder`,style:{minHeight:z(t),...k,overflow:`hidden`,...t},children:l(`div`,{style:H,children:e})})}function z(e){if(!e.height)return 200}var B,V,H,pe=e((()=>{f(),d(),n(),T(),ue(),S(A,{type:{type:C.Enum,defaultValue:`url`,displaySegmentedControl:!0,options:[`url`,`html`],optionTitles:[`URL`,`HTML`]},url:{title:`URL`,type:C.String,description:`Some websites don’t support embedding.`,hidden(e){return e.type!==`url`}},html:{title:`HTML`,type:C.String,displayTextArea:!0,hidden(e){return e.type!==`html`}},border:{title:`Border`,type:C.Border,optional:!0,hidden(e){return e.type!==`url`}},radius:{type:C.BorderRadius,title:`Radius`,hidden(e){return e.type!==`url`}},zoom:{title:`Zoom`,defaultValue:1,type:C.Number,hidden(e){return e.type!==`url`},min:.1,max:1,step:.1,displayStepper:!0}}),B={width:`100%`,height:`100%`,border:`none`},V={width:`100%`,height:`100%`,display:`flex`,flexDirection:`column`,justifyContent:`center`,alignItems:`center`},H={textAlign:`center`,minWidth:140}})),U,W,G,K,q,J,Y,X,Z,Q,$;e((()=>{d(),T(),g(),n(),pe(),ce(),U=_(A),W={},G=[],K=`framer-7YkKT`,q={QFqQrcZem:`framer-v-wirur6`},J=(e,t,n)=>e&&t?`position`:n,Y=({value:e})=>D()?null:l(`style`,{dangerouslySetInnerHTML:{__html:e},"data-framer-html-style":``}),X=({height:e,id:t,width:n,...r})=>({...r}),Z=b(ee(function(e,n){let r=t(null),i=n??r,s=c(),{activeLocale:d,setLocale:ee}=x();ie();let{style:f,className:g,layoutId:_,variant:y,...b}=X(e);w(o(()=>le({},d),[d]));let[S,C]=ne(y,W,!1),T=v(K),D=a(E)?.isLayoutTemplate,O=J(D,!!a(m)?.transition?.layout);return ae({}),l(E.Provider,{value:{activeVariantId:S,primaryVariantId:`QFqQrcZem`,variantClassNames:q},children:u(h,{id:_??s,children:[l(Y,{value:`html body { background: var(--token-e0adbe39-fbb2-4cfe-bb4e-2434da0fd9eb, rgb(204, 232, 255)); }`}),l(p.div,{...b,className:v(T,`framer-wirur6`,g),ref:i,style:{...f},children:l(re,{children:l(te,{className:`framer-1pzf59y-container`,isAuthoredByUser:!0,isModuleExternal:!0,layout:O,nodeId:`i0MjwLp6F`,scopeId:`NvHzbSRq3`,children:l(A,{height:`100%`,html:`<style>
  body { background: #fff; margin: 0; padding: 24px; }
  pre { white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 14px; line-height: 1.5; color: #111; max-width: 800px; }
  pre a { color: #0366d6; }
</style>
<pre>
# Cytara

> AI-native orchestration software for pharma manufacturers. Human-in-the-loop AI agents that generate documents, review documents for GxP/GMP compliance, and investigate deviations across Supply Chain, Manufacturing, Quality, and Commercial teams in Life Sciences.

Cytara is built for biopharma quality, manufacturing, and regulatory teams. The flagship product, Cytara GxP Reviewer, performs context-aware compliance reviews against a customer's own SOPs, methods, and quality records — pulled directly from the customer's QMS, EDMS, and ERP — and emits traceable comments that cite the exact source passage establishing each requirement. Every output is decision-support for a qualified human reviewer; Cytara never asserts compliance on its own.

## Product

- [Cytara GxP Reviewer](https://cytara.ai/): System-tray application that reviews GxP documents in under a minute. Identifies what you're working on, retrieves the right supporting documents from your QMS/EDMS/ERP, and produces traceable comments with verifiable source citations and suggested corrections. Covers batch records, SOPs, deviations, CAPAs, validations, and regulatory submissions.

## Outcomes

- Reduce review cycle times by up to 75% through automated cross-referencing and error detection.
- Accelerate time to market by shortening downstream review-dependent processes.
- Reduce costly compliance mistakes by adding a high-accuracy AI safeguard alongside human reviewers.

## How it works

- Diagnose: Map deployment options against manufacturing needs and existing systems.
- Integrate: Direct connection to DMS/QMS/ERP with pre-built connectors for Veeva, OpenText, and L7.
- Configure: Tune to site-specific systems, templates, and procedures.

## Privacy and security

- Zero data retention: Cytara does not train on customer data; enforced deletion policies.
- Enterprise security: SAML 2.0 SSO, MFA, tenant isolation, purpose-scoped service accounts.
- Data minimization: Review Assistant runs on corporate-secured devices using least-privilege principles.
- Encryption: TLS in transit, AES-256 at rest, full audit logging.

## FAQ

- How can I trust GxP Reviewer findings? Every comment is tied back to source material with traceable annotations and verifiable references the reviewer can confirm.
- Does it replace human reviewers? No. It acts as a second pair of eyes for qualified reviewers, handling first-pass detection and routine work.
- Can it work with our internal SOPs? Yes. When integrated with your QMS/DMS/ERP it automatically pulls the supporting documents needed and grounds comments in your versioned internal procedures.
- How is Cytara deployed? As a secure, enterprise-grade SaaS platform that integrates with existing systems without infrastructure changes.

## Company

- [About Cytara](https://cytara.ai/about): Engineering-led team building the AI-native platform for life sciences. Co-founded by Samar Shanazarov (CEO) and Orkun Duman (CTO).
- [Book a demo](https://cytara.ai/demo): Cytara partners with pharma and biotech companies to bring AI into high-impact workflows safely.
- [Contact](https://cytara.ai/contact): hello@cytara.ai · +1 (302) 319-4291

## Scope

- In scope: Laboratory worksheets, batch records, SOPs, deviations, CAPAs, validations, regulatory submissions.
- Out of scope: Computer Software Assurance/Verification, 21 CFR Part 11 system-of-record functionality. Cytara is decision-support, not a QMS or GxP system of record.
</pre>`,id:`i0MjwLp6F`,layoutId:`i0MjwLp6F`,radius:`0px`,style:{height:`100%`,width:`100%`},type:`html`,url:``,width:`100%`,zoom:1})})})}),l(`div`,{id:`overlay`})]})})}),[`@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }`,`.framer-7YkKT.framer-1ocvei1, .framer-7YkKT .framer-1ocvei1 { display: block; }`,`.framer-7YkKT.framer-wirur6 { align-content: center; align-items: center; background-color: var(--token-e0adbe39-fbb2-4cfe-bb4e-2434da0fd9eb, #cce8ff); display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: 1080px; justify-content: flex-start; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; width: 1200px; }`,`.framer-7YkKT .framer-1pzf59y-container { flex: 1 0 0px; height: 1px; position: relative; width: 100%; }`],`framer-7YkKT`),Q=Z,Z.displayName=`Page`,Z.defaultProps={height:1080,width:1200},y(Z,[{explicitInter:!0,fonts:[]},...U],{supportsExplicitInterCodegen:!0}),$={exports:{queryParamNames:{type:`variable`,annotations:{framerContractVersion:`1`}},default:{type:`reactComponent`,name:`FramerNvHzbSRq3`,slots:[],annotations:{framerColorSyntax:`true`,framerAcceptsLayoutTemplate:`true`,framerComponentViewportWidth:`true`,framerIntrinsicWidth:`1200`,framerCanvasComponentVariantDetails:`{"propertyName":"variant","data":{"default":{"layout":["fixed","fixed"]}}}`,framerResponsiveScreen:`true`,framerLayoutTemplateFlowEffect:`true`,framerScrollSections:`false`,framerAutoSizeImages:`true`,framerContractVersion:`1`,framerIntrinsicHeight:`1080`,framerDisplayContentsDiv:`false`,framerImmutableVariables:`true`}},Props:{type:`tsType`,annotations:{framerContractVersion:`1`}},__FramerMetadata__:{type:`variable`}}}}))();export{$ as __FramerMetadata__,Q as default,G as queryParamNames};
//# sourceMappingURL=HCF8grC2LLpezYMkf3HcFpZKotabsSaoLFDfMmeXMSU.CsOj25wx.mjs.map