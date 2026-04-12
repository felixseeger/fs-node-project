# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: image-video.spec.js >> Image and Video Node Operations >> ImageNode - can create and has UPLOAD placeholder
- Location: tests/e2e/image-video.spec.js:5:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.ms-search-input-overlay')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('.ms-search-input-overlay')
    - waiting for" http://localhost:5173/" navigation to finish...
    - navigated to "http://localhost:5173/"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e6]:
      - img "Logo" [ref=e7]
      - generic [ref=e8]: Nodespace
      - generic [ref=e9]: New
    - button "TU Test User's Workspace 1 Member" [ref=e11] [cursor=pointer]:
      - generic [ref=e12]: TU
      - generic [ref=e13]:
        - generic "Test User's Workspace" [ref=e14]
        - generic [ref=e15]: 1 Member
      - generic:
        - img
    - generic [ref=e19]:
      - button "My Workflows" [ref=e20] [cursor=pointer]:
        - img [ref=e22]
        - generic "My Workflows" [ref=e24]
      - button "Community 1" [ref=e25] [cursor=pointer]:
        - img [ref=e27]
        - generic "Community" [ref=e32]
        - generic [ref=e33]: "1"
      - button "Shared with me" [ref=e34] [cursor=pointer]:
        - img [ref=e36]
        - generic "Shared with me" [ref=e39]
    - generic [ref=e40]:
      - generic [ref=e41]: Favorites
      - generic [ref=e42]:
        - generic [ref=e43]: No favorites yet
        - generic [ref=e44]: Star a board from its menu to pin it here.
      - generic [ref=e45]: Recent Projects
      - button "Board 97" [ref=e46] [cursor=pointer]:
        - img [ref=e48]
        - generic "Board 97" [ref=e50]
      - button "Board 96" [ref=e51] [cursor=pointer]:
        - img [ref=e53]
        - generic "Board 96" [ref=e55]
      - button "Board 95" [ref=e56] [cursor=pointer]:
        - img [ref=e58]
        - generic "Board 95" [ref=e60]
      - generic [ref=e61]: Workspace
      - button "All Workspace 98" [ref=e62] [cursor=pointer]:
        - img [ref=e64]
        - generic "All Workspace" [ref=e69]
        - generic [ref=e70]: "98"
      - generic [ref=e71]: Private
      - button "All Private" [ref=e72] [cursor=pointer]:
        - img [ref=e74]
        - generic "All Private" [ref=e77]
    - generic [ref=e78]:
      - button "Trash" [ref=e79] [cursor=pointer]:
        - img [ref=e81]
      - button "Settings" [ref=e83] [cursor=pointer]:
        - img [ref=e85]
      - button "Help" [ref=e88] [cursor=pointer]:
        - img [ref=e90]
      - button "Switch to light mode" [ref=e93] [cursor=pointer]:
        - img [ref=e95]
  - main [ref=e97]:
    - generic [ref=e98]:
      - button "New Project" [ref=e99] [cursor=pointer]:
        - img [ref=e101]
        - generic [ref=e102]: New Project
      - generic [ref=e103]:
        - img [ref=e105]
        - textbox "Search" [ref=e108]
      - generic [ref=e109]:
        - button "1" [ref=e110] [cursor=pointer]:
          - img [ref=e112]
          - text: "1"
        - button "Invite" [ref=e117] [cursor=pointer]
    - generic [ref=e118]:
      - generic [ref=e119]:
        - button "All" [ref=e120] [cursor=pointer]
        - button "Community" [ref=e121] [cursor=pointer]
        - button "Favorites" [ref=e122] [cursor=pointer]
        - button "Recent" [ref=e123] [cursor=pointer]
        - button "Shared" [ref=e124] [cursor=pointer]
      - generic [ref=e125]:
        - button "⚡ Void Canvas Board 97 2026-04-12T05:00:20.003Z" [ref=e126] [cursor=pointer]:
          - generic [ref=e128]:
            - generic [ref=e129]: ⚡
            - generic [ref=e130]: Void Canvas
          - generic [ref=e131]:
            - generic "Board 97" [ref=e133]
            - generic [ref=e135]: 2026-04-12T05:00:20.003Z
        - button "⚡ Void Canvas Board 96 2026-04-12T05:00:08.929Z" [ref=e136] [cursor=pointer]:
          - generic [ref=e138]:
            - generic [ref=e139]: ⚡
            - generic [ref=e140]: Void Canvas
          - generic [ref=e141]:
            - generic "Board 96" [ref=e143]
            - generic [ref=e145]: 2026-04-12T05:00:08.929Z
        - button "⚡ Void Canvas Board 95 2026-04-12T04:59:41.116Z" [ref=e146] [cursor=pointer]:
          - generic [ref=e148]:
            - generic [ref=e149]: ⚡
            - generic [ref=e150]: Void Canvas
          - generic [ref=e151]:
            - generic "Board 95" [ref=e153]
            - generic [ref=e155]: 2026-04-12T04:59:41.116Z
        - button "⚡ Void Canvas Board 95 2026-04-12T04:59:31.508Z" [ref=e156] [cursor=pointer]:
          - generic [ref=e158]:
            - generic [ref=e159]: ⚡
            - generic [ref=e160]: Void Canvas
          - generic [ref=e161]:
            - generic "Board 95" [ref=e163]
            - generic [ref=e165]: 2026-04-12T04:59:31.508Z
        - button "⚡ Void Canvas Board 94 2026-04-12T04:59:16.115Z" [ref=e166] [cursor=pointer]:
          - generic [ref=e168]:
            - generic [ref=e169]: ⚡
            - generic [ref=e170]: Void Canvas
          - generic [ref=e171]:
            - generic "Board 94" [ref=e173]
            - generic [ref=e175]: 2026-04-12T04:59:16.115Z
        - button "⚡ Void Canvas Board 93 2026-04-12T04:59:01.559Z" [ref=e176] [cursor=pointer]:
          - generic [ref=e178]:
            - generic [ref=e179]: ⚡
            - generic [ref=e180]: Void Canvas
          - generic [ref=e181]:
            - generic "Board 93" [ref=e183]
            - generic [ref=e185]: 2026-04-12T04:59:01.559Z
        - button "⚡ Void Canvas Board 92 2026-04-12T04:58:55.580Z" [ref=e186] [cursor=pointer]:
          - generic [ref=e188]:
            - generic [ref=e189]: ⚡
            - generic [ref=e190]: Void Canvas
          - generic [ref=e191]:
            - generic "Board 92" [ref=e193]
            - generic [ref=e195]: 2026-04-12T04:58:55.580Z
        - button "⚡ Void Canvas Board 91 2026-04-12T04:58:20.145Z" [ref=e196] [cursor=pointer]:
          - generic [ref=e198]:
            - generic [ref=e199]: ⚡
            - generic [ref=e200]: Void Canvas
          - generic [ref=e201]:
            - generic "Board 91" [ref=e203]
            - generic [ref=e205]: 2026-04-12T04:58:20.145Z
        - button "⚡ Void Canvas Board 90 2026-04-12T04:57:54.940Z" [ref=e206] [cursor=pointer]:
          - generic [ref=e208]:
            - generic [ref=e209]: ⚡
            - generic [ref=e210]: Void Canvas
          - generic [ref=e211]:
            - generic "Board 90" [ref=e213]
            - generic [ref=e215]: 2026-04-12T04:57:54.940Z
        - button "⚡ Void Canvas Board 89 2026-04-12T04:57:29.234Z" [ref=e216] [cursor=pointer]:
          - generic [ref=e218]:
            - generic [ref=e219]: ⚡
            - generic [ref=e220]: Void Canvas
          - generic [ref=e221]:
            - generic "Board 89" [ref=e223]
            - generic [ref=e225]: 2026-04-12T04:57:29.234Z
        - button "⚡ Void Canvas Board 88 2026-04-12T04:56:20.712Z" [ref=e226] [cursor=pointer]:
          - generic [ref=e228]:
            - generic [ref=e229]: ⚡
            - generic [ref=e230]: Void Canvas
          - generic [ref=e231]:
            - generic "Board 88" [ref=e233]
            - generic [ref=e235]: 2026-04-12T04:56:20.712Z
        - button "⚡ Void Canvas Board 87 2026-04-12T04:56:03.920Z" [ref=e236] [cursor=pointer]:
          - generic [ref=e238]:
            - generic [ref=e239]: ⚡
            - generic [ref=e240]: Void Canvas
          - generic [ref=e241]:
            - generic "Board 87" [ref=e243]
            - generic [ref=e245]: 2026-04-12T04:56:03.920Z
        - button "⚡ Void Canvas Board 86 2026-04-12T04:27:28.603Z" [ref=e246] [cursor=pointer]:
          - generic [ref=e248]:
            - generic [ref=e249]: ⚡
            - generic [ref=e250]: Void Canvas
          - generic [ref=e251]:
            - generic "Board 86" [ref=e253]
            - generic [ref=e255]: 2026-04-12T04:27:28.603Z
        - button "⚡ Void Canvas Board 85 2026-04-12T04:25:20.092Z" [ref=e256] [cursor=pointer]:
          - generic [ref=e258]:
            - generic [ref=e259]: ⚡
            - generic [ref=e260]: Void Canvas
          - generic [ref=e261]:
            - generic "Board 85" [ref=e263]
            - generic [ref=e265]: 2026-04-12T04:25:20.092Z
        - button "⚡ Void Canvas Board 84 2026-04-12T04:24:40.294Z" [ref=e266] [cursor=pointer]:
          - generic [ref=e268]:
            - generic [ref=e269]: ⚡
            - generic [ref=e270]: Void Canvas
          - generic [ref=e271]:
            - generic "Board 84" [ref=e273]
            - generic [ref=e275]: 2026-04-12T04:24:40.294Z
        - button "⚡ Void Canvas Board 83 2026-04-12T04:23:06.514Z" [ref=e276] [cursor=pointer]:
          - generic [ref=e278]:
            - generic [ref=e279]: ⚡
            - generic [ref=e280]: Void Canvas
          - generic [ref=e281]:
            - generic "Board 83" [ref=e283]
            - generic [ref=e285]: 2026-04-12T04:23:06.514Z
        - button "⚡ Void Canvas Board 82 2026-04-12T04:22:35.619Z" [ref=e286] [cursor=pointer]:
          - generic [ref=e288]:
            - generic [ref=e289]: ⚡
            - generic [ref=e290]: Void Canvas
          - generic [ref=e291]:
            - generic "Board 82" [ref=e293]
            - generic [ref=e295]: 2026-04-12T04:22:35.619Z
        - button "⚡ Void Canvas Board 81 2026-04-12T04:21:16.668Z" [ref=e296] [cursor=pointer]:
          - generic [ref=e298]:
            - generic [ref=e299]: ⚡
            - generic [ref=e300]: Void Canvas
          - generic [ref=e301]:
            - generic "Board 81" [ref=e303]
            - generic [ref=e305]: 2026-04-12T04:21:16.668Z
        - button "⚡ Void Canvas Board 80 2026-04-12T03:55:07.394Z" [ref=e306] [cursor=pointer]:
          - generic [ref=e308]:
            - generic [ref=e309]: ⚡
            - generic [ref=e310]: Void Canvas
          - generic [ref=e311]:
            - generic "Board 80" [ref=e313]
            - generic [ref=e315]: 2026-04-12T03:55:07.394Z
        - button "⚡ Void Canvas Board 79 2026-04-12T03:54:11.866Z" [ref=e316] [cursor=pointer]:
          - generic [ref=e318]:
            - generic [ref=e319]: ⚡
            - generic [ref=e320]: Void Canvas
          - generic [ref=e321]:
            - generic "Board 79" [ref=e323]
            - generic [ref=e325]: 2026-04-12T03:54:11.866Z
        - button "⚡ Void Canvas Board 78 2026-04-12T03:51:31.795Z" [ref=e326] [cursor=pointer]:
          - generic [ref=e328]:
            - generic [ref=e329]: ⚡
            - generic [ref=e330]: Void Canvas
          - generic [ref=e331]:
            - generic "Board 78" [ref=e333]
            - generic [ref=e335]: 2026-04-12T03:51:31.795Z
        - button "⚡ Void Canvas Board 77 Public 2026-04-12T03:51:17.333Z by Test User" [ref=e336] [cursor=pointer]:
          - generic [ref=e338]:
            - generic [ref=e339]: ⚡
            - generic [ref=e340]: Void Canvas
          - generic [ref=e341]:
            - generic [ref=e342]:
              - generic "Board 77" [ref=e343]
              - generic [ref=e344]: Public
            - generic [ref=e345]:
              - generic [ref=e346]: 2026-04-12T03:51:17.333Z
              - generic "Test User" [ref=e347]: by Test User
        - button "⚡ Void Canvas Board 76 2026-04-12T03:38:12.429Z" [ref=e348] [cursor=pointer]:
          - generic [ref=e350]:
            - generic [ref=e351]: ⚡
            - generic [ref=e352]: Void Canvas
          - generic [ref=e353]:
            - generic "Board 76" [ref=e355]
            - generic [ref=e357]: 2026-04-12T03:38:12.429Z
        - button "⚡ Void Canvas Board 75 2026-04-12T03:33:50.462Z" [ref=e358] [cursor=pointer]:
          - generic [ref=e360]:
            - generic [ref=e361]: ⚡
            - generic [ref=e362]: Void Canvas
          - generic [ref=e363]:
            - generic "Board 75" [ref=e365]
            - generic [ref=e367]: 2026-04-12T03:33:50.462Z
        - button "⚡ Void Canvas Board 74 2026-04-12T03:27:19.285Z" [ref=e368] [cursor=pointer]:
          - generic [ref=e370]:
            - generic [ref=e371]: ⚡
            - generic [ref=e372]: Void Canvas
          - generic [ref=e373]:
            - generic "Board 74" [ref=e375]
            - generic [ref=e377]: 2026-04-12T03:27:19.285Z
        - button "⚡ Void Canvas Board 73 2026-04-12T03:25:48.718Z" [ref=e378] [cursor=pointer]:
          - generic [ref=e380]:
            - generic [ref=e381]: ⚡
            - generic [ref=e382]: Void Canvas
          - generic [ref=e383]:
            - generic "Board 73" [ref=e385]
            - generic [ref=e387]: 2026-04-12T03:25:48.718Z
        - button "⚡ Void Canvas Board 72 2026-04-12T03:24:22.777Z" [ref=e388] [cursor=pointer]:
          - generic [ref=e390]:
            - generic [ref=e391]: ⚡
            - generic [ref=e392]: Void Canvas
          - generic [ref=e393]:
            - generic "Board 72" [ref=e395]
            - generic [ref=e397]: 2026-04-12T03:24:22.777Z
        - button "⚡ Void Canvas Board 71 2026-04-12T03:23:52.956Z" [ref=e398] [cursor=pointer]:
          - generic [ref=e400]:
            - generic [ref=e401]: ⚡
            - generic [ref=e402]: Void Canvas
          - generic [ref=e403]:
            - generic "Board 71" [ref=e405]
            - generic [ref=e407]: 2026-04-12T03:23:52.956Z
        - button "⚡ Void Canvas Board 70 2026-04-12T03:23:36.417Z" [ref=e408] [cursor=pointer]:
          - generic [ref=e410]:
            - generic [ref=e411]: ⚡
            - generic [ref=e412]: Void Canvas
          - generic [ref=e413]:
            - generic "Board 70" [ref=e415]
            - generic [ref=e417]: 2026-04-12T03:23:36.417Z
        - button "⚡ Void Canvas Board 69 2026-04-12T03:23:06.759Z" [ref=e418] [cursor=pointer]:
          - generic [ref=e420]:
            - generic [ref=e421]: ⚡
            - generic [ref=e422]: Void Canvas
          - generic [ref=e423]:
            - generic "Board 69" [ref=e425]
            - generic [ref=e427]: 2026-04-12T03:23:06.759Z
        - button "⚡ Void Canvas Board 68 2026-04-12T03:21:13.217Z" [ref=e428] [cursor=pointer]:
          - generic [ref=e430]:
            - generic [ref=e431]: ⚡
            - generic [ref=e432]: Void Canvas
          - generic [ref=e433]:
            - generic "Board 68" [ref=e435]
            - generic [ref=e437]: 2026-04-12T03:21:13.217Z
        - button "⚡ Void Canvas Board 67 2026-04-08T17:47:33.834Z" [ref=e438] [cursor=pointer]:
          - generic [ref=e440]:
            - generic [ref=e441]: ⚡
            - generic [ref=e442]: Void Canvas
          - generic [ref=e443]:
            - generic "Board 67" [ref=e445]
            - generic [ref=e447]: 2026-04-08T17:47:33.834Z
        - button "⚡ Void Canvas Board 66 2026-04-08T17:47:15.936Z" [ref=e448] [cursor=pointer]:
          - generic [ref=e450]:
            - generic [ref=e451]: ⚡
            - generic [ref=e452]: Void Canvas
          - generic [ref=e453]:
            - generic "Board 66" [ref=e455]
            - generic [ref=e457]: 2026-04-08T17:47:15.936Z
        - button "⚡ Void Canvas Board 65 2026-04-08T17:46:20.554Z" [ref=e458] [cursor=pointer]:
          - generic [ref=e460]:
            - generic [ref=e461]: ⚡
            - generic [ref=e462]: Void Canvas
          - generic [ref=e463]:
            - generic "Board 65" [ref=e465]
            - generic [ref=e467]: 2026-04-08T17:46:20.554Z
        - button "⚡ Void Canvas Board 64 2026-04-08T17:43:32.987Z" [ref=e468] [cursor=pointer]:
          - generic [ref=e470]:
            - generic [ref=e471]: ⚡
            - generic [ref=e472]: Void Canvas
          - generic [ref=e473]:
            - generic "Board 64" [ref=e475]
            - generic [ref=e477]: 2026-04-08T17:43:32.987Z
        - button "⚡ Void Canvas Board 63 2026-04-08T17:43:14.588Z" [ref=e478] [cursor=pointer]:
          - generic [ref=e480]:
            - generic [ref=e481]: ⚡
            - generic [ref=e482]: Void Canvas
          - generic [ref=e483]:
            - generic "Board 63" [ref=e485]
            - generic [ref=e487]: 2026-04-08T17:43:14.588Z
        - button "⚡ Void Canvas Board 62 2026-04-08T17:42:18.459Z" [ref=e488] [cursor=pointer]:
          - generic [ref=e490]:
            - generic [ref=e491]: ⚡
            - generic [ref=e492]: Void Canvas
          - generic [ref=e493]:
            - generic "Board 62" [ref=e495]
            - generic [ref=e497]: 2026-04-08T17:42:18.459Z
        - button "⚡ Void Canvas Board 61 2026-04-08T04:22:02.842Z" [ref=e498] [cursor=pointer]:
          - generic [ref=e500]:
            - generic [ref=e501]: ⚡
            - generic [ref=e502]: Void Canvas
          - generic [ref=e503]:
            - generic "Board 61" [ref=e505]
            - generic [ref=e507]: 2026-04-08T04:22:02.842Z
        - button "⚡ Void Canvas Board 60 2026-04-08T04:21:43.695Z" [ref=e508] [cursor=pointer]:
          - generic [ref=e510]:
            - generic [ref=e511]: ⚡
            - generic [ref=e512]: Void Canvas
          - generic [ref=e513]:
            - generic "Board 60" [ref=e515]
            - generic [ref=e517]: 2026-04-08T04:21:43.695Z
        - button "⚡ Void Canvas Board 59 2026-04-08T04:20:42.748Z" [ref=e518] [cursor=pointer]:
          - generic [ref=e520]:
            - generic [ref=e521]: ⚡
            - generic [ref=e522]: Void Canvas
          - generic [ref=e523]:
            - generic "Board 59" [ref=e525]
            - generic [ref=e527]: 2026-04-08T04:20:42.748Z
        - button "⚡ Void Canvas Board 58 2026-04-08T04:18:48.371Z" [ref=e528] [cursor=pointer]:
          - generic [ref=e530]:
            - generic [ref=e531]: ⚡
            - generic [ref=e532]: Void Canvas
          - generic [ref=e533]:
            - generic "Board 58" [ref=e535]
            - generic [ref=e537]: 2026-04-08T04:18:48.371Z
        - button "⚡ Void Canvas Board 57 2026-04-08T04:18:29.041Z" [ref=e538] [cursor=pointer]:
          - generic [ref=e540]:
            - generic [ref=e541]: ⚡
            - generic [ref=e542]: Void Canvas
          - generic [ref=e543]:
            - generic "Board 57" [ref=e545]
            - generic [ref=e547]: 2026-04-08T04:18:29.041Z
        - button "⚡ Void Canvas Board 56 2026-04-08T04:17:28.258Z" [ref=e548] [cursor=pointer]:
          - generic [ref=e550]:
            - generic [ref=e551]: ⚡
            - generic [ref=e552]: Void Canvas
          - generic [ref=e553]:
            - generic "Board 56" [ref=e555]
            - generic [ref=e557]: 2026-04-08T04:17:28.258Z
        - button "⚡ Void Canvas Board 55 2026-04-08T04:16:28.956Z" [ref=e558] [cursor=pointer]:
          - generic [ref=e560]:
            - generic [ref=e561]: ⚡
            - generic [ref=e562]: Void Canvas
          - generic [ref=e563]:
            - generic "Board 55" [ref=e565]
            - generic [ref=e567]: 2026-04-08T04:16:28.956Z
        - button "⚡ Void Canvas Board 54 2026-04-08T04:15:57.726Z" [ref=e568] [cursor=pointer]:
          - generic [ref=e570]:
            - generic [ref=e571]: ⚡
            - generic [ref=e572]: Void Canvas
          - generic [ref=e573]:
            - generic "Board 54" [ref=e575]
            - generic [ref=e577]: 2026-04-08T04:15:57.726Z
        - button "⚡ Void Canvas Board 53 2026-04-08T04:14:57.487Z" [ref=e578] [cursor=pointer]:
          - generic [ref=e580]:
            - generic [ref=e581]: ⚡
            - generic [ref=e582]: Void Canvas
          - generic [ref=e583]:
            - generic "Board 53" [ref=e585]
            - generic [ref=e587]: 2026-04-08T04:14:57.487Z
        - button "⚡ Void Canvas Board 52 2026-04-08T04:11:41.475Z" [ref=e588] [cursor=pointer]:
          - generic [ref=e590]:
            - generic [ref=e591]: ⚡
            - generic [ref=e592]: Void Canvas
          - generic [ref=e593]:
            - generic "Board 52" [ref=e595]
            - generic [ref=e597]: 2026-04-08T04:11:41.475Z
        - button "⚡ Void Canvas Board 51 2026-04-08T04:11:09.775Z" [ref=e598] [cursor=pointer]:
          - generic [ref=e600]:
            - generic [ref=e601]: ⚡
            - generic [ref=e602]: Void Canvas
          - generic [ref=e603]:
            - generic "Board 51" [ref=e605]
            - generic [ref=e607]: 2026-04-08T04:11:09.775Z
        - button "⚡ Void Canvas Board 50 2026-04-08T04:10:08.480Z" [ref=e608] [cursor=pointer]:
          - generic [ref=e610]:
            - generic [ref=e611]: ⚡
            - generic [ref=e612]: Void Canvas
          - generic [ref=e613]:
            - generic "Board 50" [ref=e615]
            - generic [ref=e617]: 2026-04-08T04:10:08.480Z
        - button "⚡ Void Canvas Board 49 2026-04-08T03:59:34.907Z" [ref=e618] [cursor=pointer]:
          - generic [ref=e620]:
            - generic [ref=e621]: ⚡
            - generic [ref=e622]: Void Canvas
          - generic [ref=e623]:
            - generic "Board 49" [ref=e625]
            - generic [ref=e627]: 2026-04-08T03:59:34.907Z
        - button "⚡ Void Canvas Board 48 2026-04-08T03:58:17.758Z" [ref=e628] [cursor=pointer]:
          - generic [ref=e630]:
            - generic [ref=e631]: ⚡
            - generic [ref=e632]: Void Canvas
          - generic [ref=e633]:
            - generic "Board 48" [ref=e635]
            - generic [ref=e637]: 2026-04-08T03:58:17.758Z
        - button "⚡ Void Canvas Board 47 2026-04-08T03:48:21.185Z" [ref=e638] [cursor=pointer]:
          - generic [ref=e640]:
            - generic [ref=e641]: ⚡
            - generic [ref=e642]: Void Canvas
          - generic [ref=e643]:
            - generic "Board 47" [ref=e645]
            - generic [ref=e647]: 2026-04-08T03:48:21.185Z
        - button "⚡ Void Canvas Board 46 2026-04-08T03:47:21.648Z" [ref=e648] [cursor=pointer]:
          - generic [ref=e650]:
            - generic [ref=e651]: ⚡
            - generic [ref=e652]: Void Canvas
          - generic [ref=e653]:
            - generic "Board 46" [ref=e655]
            - generic [ref=e657]: 2026-04-08T03:47:21.648Z
        - button "⚡ Void Canvas Board 45 2026-04-08T03:46:13.238Z" [ref=e658] [cursor=pointer]:
          - generic [ref=e660]:
            - generic [ref=e661]: ⚡
            - generic [ref=e662]: Void Canvas
          - generic [ref=e663]:
            - generic "Board 45" [ref=e665]
            - generic [ref=e667]: 2026-04-08T03:46:13.238Z
        - button "⚡ Void Canvas Board 44 2026-04-08T03:45:14.007Z" [ref=e668] [cursor=pointer]:
          - generic [ref=e670]:
            - generic [ref=e671]: ⚡
            - generic [ref=e672]: Void Canvas
          - generic [ref=e673]:
            - generic "Board 44" [ref=e675]
            - generic [ref=e677]: 2026-04-08T03:45:14.007Z
        - button "⚡ Void Canvas Board 43 2026-04-08T03:44:10.591Z" [ref=e678] [cursor=pointer]:
          - generic [ref=e680]:
            - generic [ref=e681]: ⚡
            - generic [ref=e682]: Void Canvas
          - generic [ref=e683]:
            - generic "Board 43" [ref=e685]
            - generic [ref=e687]: 2026-04-08T03:44:10.591Z
        - button "⚡ Void Canvas Board 42 2026-04-08T03:43:40.916Z" [ref=e688] [cursor=pointer]:
          - generic [ref=e690]:
            - generic [ref=e691]: ⚡
            - generic [ref=e692]: Void Canvas
          - generic [ref=e693]:
            - generic "Board 42" [ref=e695]
            - generic [ref=e697]: 2026-04-08T03:43:40.916Z
        - button "⚡ Void Canvas Board 41 2026-04-08T03:42:22.642Z" [ref=e698] [cursor=pointer]:
          - generic [ref=e700]:
            - generic [ref=e701]: ⚡
            - generic [ref=e702]: Void Canvas
          - generic [ref=e703]:
            - generic "Board 41" [ref=e705]
            - generic [ref=e707]: 2026-04-08T03:42:22.642Z
        - button "⚡ Void Canvas Board 40 2026-04-08T03:41:54.492Z" [ref=e708] [cursor=pointer]:
          - generic [ref=e710]:
            - generic [ref=e711]: ⚡
            - generic [ref=e712]: Void Canvas
          - generic [ref=e713]:
            - generic "Board 40" [ref=e715]
            - generic [ref=e717]: 2026-04-08T03:41:54.492Z
        - button "⚡ Void Canvas Board 39 2026-04-08T03:40:37.356Z" [ref=e718] [cursor=pointer]:
          - generic [ref=e720]:
            - generic [ref=e721]: ⚡
            - generic [ref=e722]: Void Canvas
          - generic [ref=e723]:
            - generic "Board 39" [ref=e725]
            - generic [ref=e727]: 2026-04-08T03:40:37.356Z
        - button "⚡ Void Canvas Board 38 2026-04-08T03:40:08.572Z" [ref=e728] [cursor=pointer]:
          - generic [ref=e730]:
            - generic [ref=e731]: ⚡
            - generic [ref=e732]: Void Canvas
          - generic [ref=e733]:
            - generic "Board 38" [ref=e735]
            - generic [ref=e737]: 2026-04-08T03:40:08.572Z
        - button "⚡ Void Canvas Board 37 2026-04-08T03:39:12.702Z" [ref=e738] [cursor=pointer]:
          - generic [ref=e740]:
            - generic [ref=e741]: ⚡
            - generic [ref=e742]: Void Canvas
          - generic [ref=e743]:
            - generic "Board 37" [ref=e745]
            - generic [ref=e747]: 2026-04-08T03:39:12.702Z
        - button "⚡ Void Canvas Board 36 2026-04-08T03:38:44.685Z" [ref=e748] [cursor=pointer]:
          - generic [ref=e750]:
            - generic [ref=e751]: ⚡
            - generic [ref=e752]: Void Canvas
          - generic [ref=e753]:
            - generic "Board 36" [ref=e755]
            - generic [ref=e757]: 2026-04-08T03:38:44.685Z
        - button "⚡ Void Canvas Board 35 2026-04-08T03:37:37.747Z" [ref=e758] [cursor=pointer]:
          - generic [ref=e760]:
            - generic [ref=e761]: ⚡
            - generic [ref=e762]: Void Canvas
          - generic [ref=e763]:
            - generic "Board 35" [ref=e765]
            - generic [ref=e767]: 2026-04-08T03:37:37.747Z
        - button "⚡ Void Canvas Board 34 2026-04-08T03:37:09.503Z" [ref=e768] [cursor=pointer]:
          - generic [ref=e770]:
            - generic [ref=e771]: ⚡
            - generic [ref=e772]: Void Canvas
          - generic [ref=e773]:
            - generic "Board 34" [ref=e775]
            - generic [ref=e777]: 2026-04-08T03:37:09.503Z
        - button "⚡ Void Canvas Board 33 2026-04-08T03:36:09.846Z" [ref=e778] [cursor=pointer]:
          - generic [ref=e780]:
            - generic [ref=e781]: ⚡
            - generic [ref=e782]: Void Canvas
          - generic [ref=e783]:
            - generic "Board 33" [ref=e785]
            - generic [ref=e787]: 2026-04-08T03:36:09.846Z
        - button "⚡ Void Canvas Board 32 2026-04-08T03:36:00.978Z" [ref=e788] [cursor=pointer]:
          - generic [ref=e790]:
            - generic [ref=e791]: ⚡
            - generic [ref=e792]: Void Canvas
          - generic [ref=e793]:
            - generic "Board 32" [ref=e795]
            - generic [ref=e797]: 2026-04-08T03:36:00.978Z
        - button "⚡ Void Canvas Board 31 2026-04-08T03:35:42.356Z" [ref=e798] [cursor=pointer]:
          - generic [ref=e800]:
            - generic [ref=e801]: ⚡
            - generic [ref=e802]: Void Canvas
          - generic [ref=e803]:
            - generic "Board 31" [ref=e805]
            - generic [ref=e807]: 2026-04-08T03:35:42.356Z
        - button "⚡ Void Canvas Board 30 2026-04-08T03:35:33.313Z" [ref=e808] [cursor=pointer]:
          - generic [ref=e810]:
            - generic [ref=e811]: ⚡
            - generic [ref=e812]: Void Canvas
          - generic [ref=e813]:
            - generic "Board 30" [ref=e815]
            - generic [ref=e817]: 2026-04-08T03:35:33.313Z
        - button "⚡ Void Canvas Board 29 2026-04-08T03:34:42.616Z" [ref=e818] [cursor=pointer]:
          - generic [ref=e820]:
            - generic [ref=e821]: ⚡
            - generic [ref=e822]: Void Canvas
          - generic [ref=e823]:
            - generic "Board 29" [ref=e825]
            - generic [ref=e827]: 2026-04-08T03:34:42.616Z
        - button "⚡ Void Canvas Board 28 2026-04-08T03:34:33.503Z" [ref=e828] [cursor=pointer]:
          - generic [ref=e830]:
            - generic [ref=e831]: ⚡
            - generic [ref=e832]: Void Canvas
          - generic [ref=e833]:
            - generic "Board 28" [ref=e835]
            - generic [ref=e837]: 2026-04-08T03:34:33.503Z
        - button "⚡ Void Canvas Board 27 2026-04-08T03:34:26.896Z" [ref=e838] [cursor=pointer]:
          - generic [ref=e840]:
            - generic [ref=e841]: ⚡
            - generic [ref=e842]: Void Canvas
          - generic [ref=e843]:
            - generic "Board 27" [ref=e845]
            - generic [ref=e847]: 2026-04-08T03:34:26.896Z
        - button "⚡ Void Canvas Board 26 2026-04-08T03:34:17.485Z" [ref=e848] [cursor=pointer]:
          - generic [ref=e850]:
            - generic [ref=e851]: ⚡
            - generic [ref=e852]: Void Canvas
          - generic [ref=e853]:
            - generic "Board 26" [ref=e855]
            - generic [ref=e857]: 2026-04-08T03:34:17.485Z
        - button "⚡ Void Canvas Board 25 2026-04-08T03:28:18.212Z" [ref=e858] [cursor=pointer]:
          - generic [ref=e860]:
            - generic [ref=e861]: ⚡
            - generic [ref=e862]: Void Canvas
          - generic [ref=e863]:
            - generic "Board 25" [ref=e865]
            - generic [ref=e867]: 2026-04-08T03:28:18.212Z
        - button "⚡ Void Canvas Board 24 2026-04-08T03:27:45.094Z" [ref=e868] [cursor=pointer]:
          - generic [ref=e870]:
            - generic [ref=e871]: ⚡
            - generic [ref=e872]: Void Canvas
          - generic [ref=e873]:
            - generic "Board 24" [ref=e875]
            - generic [ref=e877]: 2026-04-08T03:27:45.094Z
        - button "⚡ Void Canvas Board 23 2026-04-08T03:27:10.609Z" [ref=e878] [cursor=pointer]:
          - generic [ref=e880]:
            - generic [ref=e881]: ⚡
            - generic [ref=e882]: Void Canvas
          - generic [ref=e883]:
            - generic "Board 23" [ref=e885]
            - generic [ref=e887]: 2026-04-08T03:27:10.609Z
        - button "⚡ Void Canvas Board 22 2026-04-08T03:26:56.079Z" [ref=e888] [cursor=pointer]:
          - generic [ref=e890]:
            - generic [ref=e891]: ⚡
            - generic [ref=e892]: Void Canvas
          - generic [ref=e893]:
            - generic "Board 22" [ref=e895]
            - generic [ref=e897]: 2026-04-08T03:26:56.079Z
        - button "⚡ Void Canvas Board 21 2026-04-08T03:26:35.323Z" [ref=e898] [cursor=pointer]:
          - generic [ref=e900]:
            - generic [ref=e901]: ⚡
            - generic [ref=e902]: Void Canvas
          - generic [ref=e903]:
            - generic "Board 21" [ref=e905]
            - generic [ref=e907]: 2026-04-08T03:26:35.323Z
        - button "⚡ Void Canvas Board 20 2026-04-08T03:26:20.532Z" [ref=e908] [cursor=pointer]:
          - generic [ref=e910]:
            - generic [ref=e911]: ⚡
            - generic [ref=e912]: Void Canvas
          - generic [ref=e913]:
            - generic "Board 20" [ref=e915]
            - generic [ref=e917]: 2026-04-08T03:26:20.532Z
        - button "⚡ Void Canvas Board 19 2026-04-08T03:26:07.937Z" [ref=e918] [cursor=pointer]:
          - generic [ref=e920]:
            - generic [ref=e921]: ⚡
            - generic [ref=e922]: Void Canvas
          - generic [ref=e923]:
            - generic "Board 19" [ref=e925]
            - generic [ref=e927]: 2026-04-08T03:26:07.937Z
        - button "⚡ Void Canvas Board 18 2026-04-08T03:25:49.157Z" [ref=e928] [cursor=pointer]:
          - generic [ref=e930]:
            - generic [ref=e931]: ⚡
            - generic [ref=e932]: Void Canvas
          - generic [ref=e933]:
            - generic "Board 18" [ref=e935]
            - generic [ref=e937]: 2026-04-08T03:25:49.157Z
        - button "⚡ Void Canvas Board 17 2026-04-08T03:25:44.459Z" [ref=e938] [cursor=pointer]:
          - generic [ref=e940]:
            - generic [ref=e941]: ⚡
            - generic [ref=e942]: Void Canvas
          - generic [ref=e943]:
            - generic "Board 17" [ref=e945]
            - generic [ref=e947]: 2026-04-08T03:25:44.459Z
        - button "⚡ Void Canvas Board 16 2026-04-08T03:25:20.787Z" [ref=e948] [cursor=pointer]:
          - generic [ref=e950]:
            - generic [ref=e951]: ⚡
            - generic [ref=e952]: Void Canvas
          - generic [ref=e953]:
            - generic "Board 16" [ref=e955]
            - generic [ref=e957]: 2026-04-08T03:25:20.787Z
        - button "⚡ Void Canvas Board 15 2026-04-08T03:24:57.499Z" [ref=e958] [cursor=pointer]:
          - generic [ref=e960]:
            - generic [ref=e961]: ⚡
            - generic [ref=e962]: Void Canvas
          - generic [ref=e963]:
            - generic "Board 15" [ref=e965]
            - generic [ref=e967]: 2026-04-08T03:24:57.499Z
        - button "⚡ Void Canvas Board 14 2026-04-08T03:24:44.077Z" [ref=e968] [cursor=pointer]:
          - generic [ref=e970]:
            - generic [ref=e971]: ⚡
            - generic [ref=e972]: Void Canvas
          - generic [ref=e973]:
            - generic "Board 14" [ref=e975]
            - generic [ref=e977]: 2026-04-08T03:24:44.077Z
        - button "⚡ Void Canvas Board 13 2026-04-08T03:24:33.809Z" [ref=e978] [cursor=pointer]:
          - generic [ref=e980]:
            - generic [ref=e981]: ⚡
            - generic [ref=e982]: Void Canvas
          - generic [ref=e983]:
            - generic "Board 13" [ref=e985]
            - generic [ref=e987]: 2026-04-08T03:24:33.809Z
        - button "⚡ Void Canvas Board 12 2026-04-08T03:24:21.667Z" [ref=e988] [cursor=pointer]:
          - generic [ref=e990]:
            - generic [ref=e991]: ⚡
            - generic [ref=e992]: Void Canvas
          - generic [ref=e993]:
            - generic "Board 12" [ref=e995]
            - generic [ref=e997]: 2026-04-08T03:24:21.667Z
        - button "⚡ Void Canvas Board 11 2026-04-08T03:23:57.278Z" [ref=e998] [cursor=pointer]:
          - generic [ref=e1000]:
            - generic [ref=e1001]: ⚡
            - generic [ref=e1002]: Void Canvas
          - generic [ref=e1003]:
            - generic "Board 11" [ref=e1005]
            - generic [ref=e1007]: 2026-04-08T03:23:57.278Z
        - button "⚡ Void Canvas Board 10 2026-04-08T03:23:34.613Z" [ref=e1008] [cursor=pointer]:
          - generic [ref=e1010]:
            - generic [ref=e1011]: ⚡
            - generic [ref=e1012]: Void Canvas
          - generic [ref=e1013]:
            - generic "Board 10" [ref=e1015]
            - generic [ref=e1017]: 2026-04-08T03:23:34.613Z
        - button "⚡ Void Canvas Board 09 2026-04-08T03:23:12.366Z" [ref=e1018] [cursor=pointer]:
          - generic [ref=e1020]:
            - generic [ref=e1021]: ⚡
            - generic [ref=e1022]: Void Canvas
          - generic [ref=e1023]:
            - generic "Board 09" [ref=e1025]
            - generic [ref=e1027]: 2026-04-08T03:23:12.366Z
        - button "⚡ Void Canvas Board 08 2026-04-08T03:22:50.569Z" [ref=e1028] [cursor=pointer]:
          - generic [ref=e1030]:
            - generic [ref=e1031]: ⚡
            - generic [ref=e1032]: Void Canvas
          - generic [ref=e1033]:
            - generic "Board 08" [ref=e1035]
            - generic [ref=e1037]: 2026-04-08T03:22:50.569Z
        - button "⚡ Void Canvas Board 07 2026-04-08T02:49:27.565Z" [ref=e1038] [cursor=pointer]:
          - generic [ref=e1040]:
            - generic [ref=e1041]: ⚡
            - generic [ref=e1042]: Void Canvas
          - generic [ref=e1043]:
            - generic "Board 07" [ref=e1045]
            - generic [ref=e1047]: 2026-04-08T02:49:27.565Z
        - button "⚡ Void Canvas Board 06 2026-04-08T02:48:55.764Z" [ref=e1048] [cursor=pointer]:
          - generic [ref=e1050]:
            - generic [ref=e1051]: ⚡
            - generic [ref=e1052]: Void Canvas
          - generic [ref=e1053]:
            - generic "Board 06" [ref=e1055]
            - generic [ref=e1057]: 2026-04-08T02:48:55.764Z
        - button "⚡ Void Canvas Board 05 2026-04-08T02:47:13.052Z" [ref=e1058] [cursor=pointer]:
          - generic [ref=e1060]:
            - generic [ref=e1061]: ⚡
            - generic [ref=e1062]: Void Canvas
          - generic [ref=e1063]:
            - generic "Board 05" [ref=e1065]
            - generic [ref=e1067]: 2026-04-08T02:47:13.052Z
        - button "⚡ Void Canvas Board 04 2026-04-08T02:45:35.919Z" [ref=e1068] [cursor=pointer]:
          - generic [ref=e1070]:
            - generic [ref=e1071]: ⚡
            - generic [ref=e1072]: Void Canvas
          - generic [ref=e1073]:
            - generic "Board 04" [ref=e1075]
            - generic [ref=e1077]: 2026-04-08T02:45:35.919Z
        - button "⚡ Void Canvas Board 03 2026-04-08T02:44:35.088Z" [ref=e1078] [cursor=pointer]:
          - generic [ref=e1080]:
            - generic [ref=e1081]: ⚡
            - generic [ref=e1082]: Void Canvas
          - generic [ref=e1083]:
            - generic "Board 03" [ref=e1085]
            - generic [ref=e1087]: 2026-04-08T02:44:35.088Z
        - button "⚡ Void Canvas Board 02 2026-04-08T02:30:56.912Z" [ref=e1088] [cursor=pointer]:
          - generic [ref=e1090]:
            - generic [ref=e1091]: ⚡
            - generic [ref=e1092]: Void Canvas
          - generic [ref=e1093]:
            - generic "Board 02" [ref=e1095]
            - generic [ref=e1097]: 2026-04-08T02:30:56.912Z
        - button "⚡ Void Canvas Board 01 2026-04-08T02:25:37.044Z" [ref=e1098] [cursor=pointer]:
          - generic [ref=e1100]:
            - generic [ref=e1101]: ⚡
            - generic [ref=e1102]: Void Canvas
          - generic [ref=e1103]:
            - generic "Board 01" [ref=e1105]
            - generic [ref=e1107]: 2026-04-08T02:25:37.044Z
```

# Test source

```ts
  1  | import { test, expect } from './fixtures.js';
  2  | 
  3  | test.describe('Image and Video Node Operations', () => {
  4  | 
  5  |   test('ImageNode - can create and has UPLOAD placeholder', async ({ editorPage: page }) => {
  6  |     await expect(page.locator('.react-flow__pane')).toBeVisible();
  7  | 
  8  |     await page.evaluate(() => {
  9  |       window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
  10 |     });
  11 |     
  12 |     const searchInput = page.locator('.ms-search-input-overlay');
> 13 |     await expect(searchInput).toBeVisible();
     |                               ^ Error: expect(locator).toBeVisible() failed
  14 |     
  15 |     await searchInput.fill('imageNode');
  16 |     await page.waitForTimeout(300);
  17 |     
  18 |     await page.evaluate(() => {
  19 |       const btn = document.querySelector('.ms-node-list button.ms-node-btn');
  20 |       if (btn) btn.click();
  21 |     });
  22 |     
  23 |     const imageNode = page.locator('.react-flow__node-imageNode').first();
  24 |     await expect(imageNode).toBeVisible();
  25 |     await expect(imageNode.locator('text=UPLOAD')).toBeVisible({ timeout: 15000 });
  26 |     
  27 |     await page.screenshot({ path: 'tests/e2e/screenshots/image_node_created.png' });
  28 |   });
  29 | 
  30 |   test('VideoOutputNode - can create and shows "No video connected"', async ({ editorPage: page }) => {
  31 |     await expect(page.locator('.react-flow__pane')).toBeVisible();
  32 | 
  33 |     await page.evaluate(() => {
  34 |       window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
  35 |     });
  36 |     
  37 |     const searchInput = page.locator('.ms-search-input-overlay');
  38 |     await expect(searchInput).toBeVisible();
  39 |     
  40 |     await searchInput.fill('videoOutput');
  41 |     await page.waitForTimeout(500); // Increased wait
  42 |     
  43 |     await page.evaluate(() => {
  44 |       // Find the specific button for videoOutput
  45 |       const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
  46 |       const videoBtn = btns.find(b => b.textContent.includes('videoOutput'));
  47 |       if (videoBtn) videoBtn.click();
  48 |       else if (btns[0]) btns[0].click(); // Fallback to first if exact not found
  49 |     });
  50 |     
  51 |     const videoOutputNode = page.locator('.react-flow__node-videoOutput').first();
  52 |     await expect(videoOutputNode).toBeVisible({ timeout: 15000 });
  53 |     
  54 |     await expect(videoOutputNode.locator('text=No video connected')).toBeVisible();
  55 |     await page.screenshot({ path: 'tests/e2e/screenshots/video_output_node_created.png' });
  56 |   });
  57 | 
  58 |   test('ImageUniversalGeneratorNode - can create and check title', async ({ editorPage: page }) => {
  59 |     await expect(page.locator('.react-flow__pane')).toBeVisible();
  60 | 
  61 |     await page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
  62 |     
  63 |     const searchInput = page.locator('.ms-search-input-overlay');
  64 |     await expect(searchInput).toBeVisible();
  65 | 
  66 |     await searchInput.fill('universalGeneratorImage');
  67 |     await page.waitForTimeout(500); // Increased wait
  68 |     
  69 |     await page.evaluate(() => {
  70 |       const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
  71 |       const genBtn = btns.find(b => b.textContent.includes('universalGeneratorImage'));
  72 |       if (genBtn) genBtn.click();
  73 |       else if (btns[0]) btns[0].click();
  74 |     });
  75 | 
  76 |     const genNode = page.locator('.react-flow__node-universalGeneratorImage').first();
  77 |     await expect(genNode).toBeVisible({ timeout: 15000 });
  78 |     
  79 |     await expect(genNode.locator('text=Universal Image Generator')).toBeVisible();
  80 |     await page.screenshot({ path: 'tests/e2e/screenshots/image_gen_node_created.png' });
  81 |   });
  82 | });
  83 | 
```