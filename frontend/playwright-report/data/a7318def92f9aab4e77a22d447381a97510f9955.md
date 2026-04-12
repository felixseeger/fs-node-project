# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: image-video-v7.spec.js >> Image and Video Node Operations >> Check Nodes Availability and Visuals
- Location: tests/e2e/image-video-v7.spec.js:5:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.react-flow__node-videoOutput').first()
Expected: visible
Timeout: 20000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 20000ms
  - waiting for locator('.react-flow__node-videoOutput').first()

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
      - button "Board 108" [ref=e46] [cursor=pointer]:
        - img [ref=e48]
        - generic "Board 108" [ref=e50]
      - button "Board 108" [ref=e51] [cursor=pointer]:
        - img [ref=e53]
        - generic "Board 108" [ref=e55]
      - button "Board 107" [ref=e56] [cursor=pointer]:
        - img [ref=e58]
        - generic "Board 107" [ref=e60]
      - generic [ref=e61]: Workspace
      - button "All Workspace 100" [ref=e62] [cursor=pointer]:
        - img [ref=e64]
        - generic "All Workspace" [ref=e69]
        - generic [ref=e70]: "100"
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
        - button "⚡ Void Canvas Board 108 2026-04-12T05:08:56.562Z" [ref=e126] [cursor=pointer]:
          - generic [ref=e128]:
            - generic [ref=e129]: ⚡
            - generic [ref=e130]: Void Canvas
          - generic [ref=e131]:
            - generic "Board 108" [ref=e133]
            - generic [ref=e135]: 2026-04-12T05:08:56.562Z
        - button "⚡ Void Canvas Board 108 2026-04-12T05:08:55.354Z" [ref=e136] [cursor=pointer]:
          - generic [ref=e138]:
            - generic [ref=e139]: ⚡
            - generic [ref=e140]: Void Canvas
          - generic [ref=e141]:
            - generic "Board 108" [ref=e143]
            - generic [ref=e145]: 2026-04-12T05:08:55.354Z
        - button "⚡ Void Canvas Board 107 2026-04-12T05:08:26.768Z" [ref=e146] [cursor=pointer]:
          - generic [ref=e148]:
            - generic [ref=e149]: ⚡
            - generic [ref=e150]: Void Canvas
          - generic [ref=e151]:
            - generic "Board 107" [ref=e153]
            - generic [ref=e155]: 2026-04-12T05:08:26.768Z
        - button "⚡ Void Canvas Board 106 2026-04-12T05:07:50.530Z" [ref=e156] [cursor=pointer]:
          - generic [ref=e158]:
            - generic [ref=e159]: ⚡
            - generic [ref=e160]: Void Canvas
          - generic [ref=e161]:
            - generic "Board 106" [ref=e163]
            - generic [ref=e165]: 2026-04-12T05:07:50.530Z
        - button "⚡ Void Canvas Board 105 2026-04-12T05:07:38.845Z" [ref=e166] [cursor=pointer]:
          - generic [ref=e168]:
            - generic [ref=e169]: ⚡
            - generic [ref=e170]: Void Canvas
          - generic [ref=e171]:
            - generic "Board 105" [ref=e173]
            - generic [ref=e175]: 2026-04-12T05:07:38.845Z
        - button "⚡ Void Canvas Board 104 2026-04-12T05:07:24.975Z" [ref=e176] [cursor=pointer]:
          - generic [ref=e178]:
            - generic [ref=e179]: ⚡
            - generic [ref=e180]: Void Canvas
          - generic [ref=e181]:
            - generic "Board 104" [ref=e183]
            - generic [ref=e185]: 2026-04-12T05:07:24.975Z
        - button "⚡ Void Canvas Board 103 2026-04-12T05:06:40.822Z" [ref=e186] [cursor=pointer]:
          - generic [ref=e188]:
            - generic [ref=e189]: ⚡
            - generic [ref=e190]: Void Canvas
          - generic [ref=e191]:
            - generic "Board 103" [ref=e193]
            - generic [ref=e195]: 2026-04-12T05:06:40.822Z
        - button "⚡ Void Canvas Board 102 2026-04-12T05:05:46.072Z" [ref=e196] [cursor=pointer]:
          - generic [ref=e198]:
            - generic [ref=e199]: ⚡
            - generic [ref=e200]: Void Canvas
          - generic [ref=e201]:
            - generic "Board 102" [ref=e203]
            - generic [ref=e205]: 2026-04-12T05:05:46.072Z
        - button "⚡ Void Canvas Board 101 2026-04-12T05:04:45.029Z" [ref=e206] [cursor=pointer]:
          - generic [ref=e208]:
            - generic [ref=e209]: ⚡
            - generic [ref=e210]: Void Canvas
          - generic [ref=e211]:
            - generic "Board 101" [ref=e213]
            - generic [ref=e215]: 2026-04-12T05:04:45.029Z
        - button "⚡ Void Canvas Board 100 2026-04-12T05:02:48.398Z" [ref=e216] [cursor=pointer]:
          - generic [ref=e218]:
            - generic [ref=e219]: ⚡
            - generic [ref=e220]: Void Canvas
          - generic [ref=e221]:
            - generic "Board 100" [ref=e223]
            - generic [ref=e225]: 2026-04-12T05:02:48.398Z
        - button "⚡ Void Canvas Board 99 2026-04-12T05:02:18.408Z" [ref=e226] [cursor=pointer]:
          - generic [ref=e228]:
            - generic [ref=e229]: ⚡
            - generic [ref=e230]: Void Canvas
          - generic [ref=e231]:
            - generic "Board 99" [ref=e233]
            - generic [ref=e235]: 2026-04-12T05:02:18.408Z
        - button "⚡ Void Canvas Board 98 2026-04-12T05:00:44.571Z" [ref=e236] [cursor=pointer]:
          - generic [ref=e238]:
            - generic [ref=e239]: ⚡
            - generic [ref=e240]: Void Canvas
          - generic [ref=e241]:
            - generic "Board 98" [ref=e243]
            - generic [ref=e245]: 2026-04-12T05:00:44.571Z
        - button "⚡ Void Canvas Board 97 2026-04-12T05:00:20.003Z" [ref=e246] [cursor=pointer]:
          - generic [ref=e248]:
            - generic [ref=e249]: ⚡
            - generic [ref=e250]: Void Canvas
          - generic [ref=e251]:
            - generic "Board 97" [ref=e253]
            - generic [ref=e255]: 2026-04-12T05:00:20.003Z
        - button "⚡ Void Canvas Board 96 2026-04-12T05:00:08.929Z" [ref=e256] [cursor=pointer]:
          - generic [ref=e258]:
            - generic [ref=e259]: ⚡
            - generic [ref=e260]: Void Canvas
          - generic [ref=e261]:
            - generic "Board 96" [ref=e263]
            - generic [ref=e265]: 2026-04-12T05:00:08.929Z
        - button "⚡ Void Canvas Board 95 2026-04-12T04:59:41.116Z" [ref=e266] [cursor=pointer]:
          - generic [ref=e268]:
            - generic [ref=e269]: ⚡
            - generic [ref=e270]: Void Canvas
          - generic [ref=e271]:
            - generic "Board 95" [ref=e273]
            - generic [ref=e275]: 2026-04-12T04:59:41.116Z
        - button "⚡ Void Canvas Board 95 2026-04-12T04:59:31.508Z" [ref=e276] [cursor=pointer]:
          - generic [ref=e278]:
            - generic [ref=e279]: ⚡
            - generic [ref=e280]: Void Canvas
          - generic [ref=e281]:
            - generic "Board 95" [ref=e283]
            - generic [ref=e285]: 2026-04-12T04:59:31.508Z
        - button "⚡ Void Canvas Board 94 2026-04-12T04:59:16.115Z" [ref=e286] [cursor=pointer]:
          - generic [ref=e288]:
            - generic [ref=e289]: ⚡
            - generic [ref=e290]: Void Canvas
          - generic [ref=e291]:
            - generic "Board 94" [ref=e293]
            - generic [ref=e295]: 2026-04-12T04:59:16.115Z
        - button "⚡ Void Canvas Board 93 2026-04-12T04:59:01.559Z" [ref=e296] [cursor=pointer]:
          - generic [ref=e298]:
            - generic [ref=e299]: ⚡
            - generic [ref=e300]: Void Canvas
          - generic [ref=e301]:
            - generic "Board 93" [ref=e303]
            - generic [ref=e305]: 2026-04-12T04:59:01.559Z
        - button "⚡ Void Canvas Board 92 2026-04-12T04:58:55.580Z" [ref=e306] [cursor=pointer]:
          - generic [ref=e308]:
            - generic [ref=e309]: ⚡
            - generic [ref=e310]: Void Canvas
          - generic [ref=e311]:
            - generic "Board 92" [ref=e313]
            - generic [ref=e315]: 2026-04-12T04:58:55.580Z
        - button "⚡ Void Canvas Board 91 2026-04-12T04:58:20.145Z" [ref=e316] [cursor=pointer]:
          - generic [ref=e318]:
            - generic [ref=e319]: ⚡
            - generic [ref=e320]: Void Canvas
          - generic [ref=e321]:
            - generic "Board 91" [ref=e323]
            - generic [ref=e325]: 2026-04-12T04:58:20.145Z
        - button "⚡ Void Canvas Board 90 2026-04-12T04:57:54.940Z" [ref=e326] [cursor=pointer]:
          - generic [ref=e328]:
            - generic [ref=e329]: ⚡
            - generic [ref=e330]: Void Canvas
          - generic [ref=e331]:
            - generic "Board 90" [ref=e333]
            - generic [ref=e335]: 2026-04-12T04:57:54.940Z
        - button "⚡ Void Canvas Board 89 2026-04-12T04:57:29.234Z" [ref=e336] [cursor=pointer]:
          - generic [ref=e338]:
            - generic [ref=e339]: ⚡
            - generic [ref=e340]: Void Canvas
          - generic [ref=e341]:
            - generic "Board 89" [ref=e343]
            - generic [ref=e345]: 2026-04-12T04:57:29.234Z
        - button "⚡ Void Canvas Board 88 2026-04-12T04:56:20.712Z" [ref=e346] [cursor=pointer]:
          - generic [ref=e348]:
            - generic [ref=e349]: ⚡
            - generic [ref=e350]: Void Canvas
          - generic [ref=e351]:
            - generic "Board 88" [ref=e353]
            - generic [ref=e355]: 2026-04-12T04:56:20.712Z
        - button "⚡ Void Canvas Board 87 2026-04-12T04:56:03.920Z" [ref=e356] [cursor=pointer]:
          - generic [ref=e358]:
            - generic [ref=e359]: ⚡
            - generic [ref=e360]: Void Canvas
          - generic [ref=e361]:
            - generic "Board 87" [ref=e363]
            - generic [ref=e365]: 2026-04-12T04:56:03.920Z
        - button "⚡ Void Canvas Board 86 2026-04-12T04:27:28.603Z" [ref=e366] [cursor=pointer]:
          - generic [ref=e368]:
            - generic [ref=e369]: ⚡
            - generic [ref=e370]: Void Canvas
          - generic [ref=e371]:
            - generic "Board 86" [ref=e373]
            - generic [ref=e375]: 2026-04-12T04:27:28.603Z
        - button "⚡ Void Canvas Board 85 2026-04-12T04:25:20.092Z" [ref=e376] [cursor=pointer]:
          - generic [ref=e378]:
            - generic [ref=e379]: ⚡
            - generic [ref=e380]: Void Canvas
          - generic [ref=e381]:
            - generic "Board 85" [ref=e383]
            - generic [ref=e385]: 2026-04-12T04:25:20.092Z
        - button "⚡ Void Canvas Board 84 2026-04-12T04:24:40.294Z" [ref=e386] [cursor=pointer]:
          - generic [ref=e388]:
            - generic [ref=e389]: ⚡
            - generic [ref=e390]: Void Canvas
          - generic [ref=e391]:
            - generic "Board 84" [ref=e393]
            - generic [ref=e395]: 2026-04-12T04:24:40.294Z
        - button "⚡ Void Canvas Board 83 2026-04-12T04:23:06.514Z" [ref=e396] [cursor=pointer]:
          - generic [ref=e398]:
            - generic [ref=e399]: ⚡
            - generic [ref=e400]: Void Canvas
          - generic [ref=e401]:
            - generic "Board 83" [ref=e403]
            - generic [ref=e405]: 2026-04-12T04:23:06.514Z
        - button "⚡ Void Canvas Board 82 2026-04-12T04:22:35.619Z" [ref=e406] [cursor=pointer]:
          - generic [ref=e408]:
            - generic [ref=e409]: ⚡
            - generic [ref=e410]: Void Canvas
          - generic [ref=e411]:
            - generic "Board 82" [ref=e413]
            - generic [ref=e415]: 2026-04-12T04:22:35.619Z
        - button "⚡ Void Canvas Board 81 2026-04-12T04:21:16.668Z" [ref=e416] [cursor=pointer]:
          - generic [ref=e418]:
            - generic [ref=e419]: ⚡
            - generic [ref=e420]: Void Canvas
          - generic [ref=e421]:
            - generic "Board 81" [ref=e423]
            - generic [ref=e425]: 2026-04-12T04:21:16.668Z
        - button "⚡ Void Canvas Board 80 2026-04-12T03:55:07.394Z" [ref=e426] [cursor=pointer]:
          - generic [ref=e428]:
            - generic [ref=e429]: ⚡
            - generic [ref=e430]: Void Canvas
          - generic [ref=e431]:
            - generic "Board 80" [ref=e433]
            - generic [ref=e435]: 2026-04-12T03:55:07.394Z
        - button "⚡ Void Canvas Board 79 2026-04-12T03:54:11.866Z" [ref=e436] [cursor=pointer]:
          - generic [ref=e438]:
            - generic [ref=e439]: ⚡
            - generic [ref=e440]: Void Canvas
          - generic [ref=e441]:
            - generic "Board 79" [ref=e443]
            - generic [ref=e445]: 2026-04-12T03:54:11.866Z
        - button "⚡ Void Canvas Board 78 2026-04-12T03:51:31.795Z" [ref=e446] [cursor=pointer]:
          - generic [ref=e448]:
            - generic [ref=e449]: ⚡
            - generic [ref=e450]: Void Canvas
          - generic [ref=e451]:
            - generic "Board 78" [ref=e453]
            - generic [ref=e455]: 2026-04-12T03:51:31.795Z
        - button "⚡ Void Canvas Board 77 Public 2026-04-12T03:51:17.333Z by Test User" [ref=e456] [cursor=pointer]:
          - generic [ref=e458]:
            - generic [ref=e459]: ⚡
            - generic [ref=e460]: Void Canvas
          - generic [ref=e461]:
            - generic [ref=e462]:
              - generic "Board 77" [ref=e463]
              - generic [ref=e464]: Public
            - generic [ref=e465]:
              - generic [ref=e466]: 2026-04-12T03:51:17.333Z
              - generic "Test User" [ref=e467]: by Test User
        - button "⚡ Void Canvas Board 76 2026-04-12T03:38:12.429Z" [ref=e468] [cursor=pointer]:
          - generic [ref=e470]:
            - generic [ref=e471]: ⚡
            - generic [ref=e472]: Void Canvas
          - generic [ref=e473]:
            - generic "Board 76" [ref=e475]
            - generic [ref=e477]: 2026-04-12T03:38:12.429Z
        - button "⚡ Void Canvas Board 75 2026-04-12T03:33:50.462Z" [ref=e478] [cursor=pointer]:
          - generic [ref=e480]:
            - generic [ref=e481]: ⚡
            - generic [ref=e482]: Void Canvas
          - generic [ref=e483]:
            - generic "Board 75" [ref=e485]
            - generic [ref=e487]: 2026-04-12T03:33:50.462Z
        - button "⚡ Void Canvas Board 74 2026-04-12T03:27:19.285Z" [ref=e488] [cursor=pointer]:
          - generic [ref=e490]:
            - generic [ref=e491]: ⚡
            - generic [ref=e492]: Void Canvas
          - generic [ref=e493]:
            - generic "Board 74" [ref=e495]
            - generic [ref=e497]: 2026-04-12T03:27:19.285Z
        - button "⚡ Void Canvas Board 73 2026-04-12T03:25:48.718Z" [ref=e498] [cursor=pointer]:
          - generic [ref=e500]:
            - generic [ref=e501]: ⚡
            - generic [ref=e502]: Void Canvas
          - generic [ref=e503]:
            - generic "Board 73" [ref=e505]
            - generic [ref=e507]: 2026-04-12T03:25:48.718Z
        - button "⚡ Void Canvas Board 72 2026-04-12T03:24:22.777Z" [ref=e508] [cursor=pointer]:
          - generic [ref=e510]:
            - generic [ref=e511]: ⚡
            - generic [ref=e512]: Void Canvas
          - generic [ref=e513]:
            - generic "Board 72" [ref=e515]
            - generic [ref=e517]: 2026-04-12T03:24:22.777Z
        - button "⚡ Void Canvas Board 71 2026-04-12T03:23:52.956Z" [ref=e518] [cursor=pointer]:
          - generic [ref=e520]:
            - generic [ref=e521]: ⚡
            - generic [ref=e522]: Void Canvas
          - generic [ref=e523]:
            - generic "Board 71" [ref=e525]
            - generic [ref=e527]: 2026-04-12T03:23:52.956Z
        - button "⚡ Void Canvas Board 70 2026-04-12T03:23:36.417Z" [ref=e528] [cursor=pointer]:
          - generic [ref=e530]:
            - generic [ref=e531]: ⚡
            - generic [ref=e532]: Void Canvas
          - generic [ref=e533]:
            - generic "Board 70" [ref=e535]
            - generic [ref=e537]: 2026-04-12T03:23:36.417Z
        - button "⚡ Void Canvas Board 69 2026-04-12T03:23:06.759Z" [ref=e538] [cursor=pointer]:
          - generic [ref=e540]:
            - generic [ref=e541]: ⚡
            - generic [ref=e542]: Void Canvas
          - generic [ref=e543]:
            - generic "Board 69" [ref=e545]
            - generic [ref=e547]: 2026-04-12T03:23:06.759Z
        - button "⚡ Void Canvas Board 68 2026-04-12T03:21:13.217Z" [ref=e548] [cursor=pointer]:
          - generic [ref=e550]:
            - generic [ref=e551]: ⚡
            - generic [ref=e552]: Void Canvas
          - generic [ref=e553]:
            - generic "Board 68" [ref=e555]
            - generic [ref=e557]: 2026-04-12T03:21:13.217Z
        - button "⚡ Void Canvas Board 67 2026-04-08T17:47:33.834Z" [ref=e558] [cursor=pointer]:
          - generic [ref=e560]:
            - generic [ref=e561]: ⚡
            - generic [ref=e562]: Void Canvas
          - generic [ref=e563]:
            - generic "Board 67" [ref=e565]
            - generic [ref=e567]: 2026-04-08T17:47:33.834Z
        - button "⚡ Void Canvas Board 66 2026-04-08T17:47:15.936Z" [ref=e568] [cursor=pointer]:
          - generic [ref=e570]:
            - generic [ref=e571]: ⚡
            - generic [ref=e572]: Void Canvas
          - generic [ref=e573]:
            - generic "Board 66" [ref=e575]
            - generic [ref=e577]: 2026-04-08T17:47:15.936Z
        - button "⚡ Void Canvas Board 65 2026-04-08T17:46:20.554Z" [ref=e578] [cursor=pointer]:
          - generic [ref=e580]:
            - generic [ref=e581]: ⚡
            - generic [ref=e582]: Void Canvas
          - generic [ref=e583]:
            - generic "Board 65" [ref=e585]
            - generic [ref=e587]: 2026-04-08T17:46:20.554Z
        - button "⚡ Void Canvas Board 64 2026-04-08T17:43:32.987Z" [ref=e588] [cursor=pointer]:
          - generic [ref=e590]:
            - generic [ref=e591]: ⚡
            - generic [ref=e592]: Void Canvas
          - generic [ref=e593]:
            - generic "Board 64" [ref=e595]
            - generic [ref=e597]: 2026-04-08T17:43:32.987Z
        - button "⚡ Void Canvas Board 63 2026-04-08T17:43:14.588Z" [ref=e598] [cursor=pointer]:
          - generic [ref=e600]:
            - generic [ref=e601]: ⚡
            - generic [ref=e602]: Void Canvas
          - generic [ref=e603]:
            - generic "Board 63" [ref=e605]
            - generic [ref=e607]: 2026-04-08T17:43:14.588Z
        - button "⚡ Void Canvas Board 62 2026-04-08T17:42:18.459Z" [ref=e608] [cursor=pointer]:
          - generic [ref=e610]:
            - generic [ref=e611]: ⚡
            - generic [ref=e612]: Void Canvas
          - generic [ref=e613]:
            - generic "Board 62" [ref=e615]
            - generic [ref=e617]: 2026-04-08T17:42:18.459Z
        - button "⚡ Void Canvas Board 61 2026-04-08T04:22:02.842Z" [ref=e618] [cursor=pointer]:
          - generic [ref=e620]:
            - generic [ref=e621]: ⚡
            - generic [ref=e622]: Void Canvas
          - generic [ref=e623]:
            - generic "Board 61" [ref=e625]
            - generic [ref=e627]: 2026-04-08T04:22:02.842Z
        - button "⚡ Void Canvas Board 60 2026-04-08T04:21:43.695Z" [ref=e628] [cursor=pointer]:
          - generic [ref=e630]:
            - generic [ref=e631]: ⚡
            - generic [ref=e632]: Void Canvas
          - generic [ref=e633]:
            - generic "Board 60" [ref=e635]
            - generic [ref=e637]: 2026-04-08T04:21:43.695Z
        - button "⚡ Void Canvas Board 59 2026-04-08T04:20:42.748Z" [ref=e638] [cursor=pointer]:
          - generic [ref=e640]:
            - generic [ref=e641]: ⚡
            - generic [ref=e642]: Void Canvas
          - generic [ref=e643]:
            - generic "Board 59" [ref=e645]
            - generic [ref=e647]: 2026-04-08T04:20:42.748Z
        - button "⚡ Void Canvas Board 58 2026-04-08T04:18:48.371Z" [ref=e648] [cursor=pointer]:
          - generic [ref=e650]:
            - generic [ref=e651]: ⚡
            - generic [ref=e652]: Void Canvas
          - generic [ref=e653]:
            - generic "Board 58" [ref=e655]
            - generic [ref=e657]: 2026-04-08T04:18:48.371Z
        - button "⚡ Void Canvas Board 57 2026-04-08T04:18:29.041Z" [ref=e658] [cursor=pointer]:
          - generic [ref=e660]:
            - generic [ref=e661]: ⚡
            - generic [ref=e662]: Void Canvas
          - generic [ref=e663]:
            - generic "Board 57" [ref=e665]
            - generic [ref=e667]: 2026-04-08T04:18:29.041Z
        - button "⚡ Void Canvas Board 56 2026-04-08T04:17:28.258Z" [ref=e668] [cursor=pointer]:
          - generic [ref=e670]:
            - generic [ref=e671]: ⚡
            - generic [ref=e672]: Void Canvas
          - generic [ref=e673]:
            - generic "Board 56" [ref=e675]
            - generic [ref=e677]: 2026-04-08T04:17:28.258Z
        - button "⚡ Void Canvas Board 55 2026-04-08T04:16:28.956Z" [ref=e678] [cursor=pointer]:
          - generic [ref=e680]:
            - generic [ref=e681]: ⚡
            - generic [ref=e682]: Void Canvas
          - generic [ref=e683]:
            - generic "Board 55" [ref=e685]
            - generic [ref=e687]: 2026-04-08T04:16:28.956Z
        - button "⚡ Void Canvas Board 54 2026-04-08T04:15:57.726Z" [ref=e688] [cursor=pointer]:
          - generic [ref=e690]:
            - generic [ref=e691]: ⚡
            - generic [ref=e692]: Void Canvas
          - generic [ref=e693]:
            - generic "Board 54" [ref=e695]
            - generic [ref=e697]: 2026-04-08T04:15:57.726Z
        - button "⚡ Void Canvas Board 53 2026-04-08T04:14:57.487Z" [ref=e698] [cursor=pointer]:
          - generic [ref=e700]:
            - generic [ref=e701]: ⚡
            - generic [ref=e702]: Void Canvas
          - generic [ref=e703]:
            - generic "Board 53" [ref=e705]
            - generic [ref=e707]: 2026-04-08T04:14:57.487Z
        - button "⚡ Void Canvas Board 52 2026-04-08T04:11:41.475Z" [ref=e708] [cursor=pointer]:
          - generic [ref=e710]:
            - generic [ref=e711]: ⚡
            - generic [ref=e712]: Void Canvas
          - generic [ref=e713]:
            - generic "Board 52" [ref=e715]
            - generic [ref=e717]: 2026-04-08T04:11:41.475Z
        - button "⚡ Void Canvas Board 51 2026-04-08T04:11:09.775Z" [ref=e718] [cursor=pointer]:
          - generic [ref=e720]:
            - generic [ref=e721]: ⚡
            - generic [ref=e722]: Void Canvas
          - generic [ref=e723]:
            - generic "Board 51" [ref=e725]
            - generic [ref=e727]: 2026-04-08T04:11:09.775Z
        - button "⚡ Void Canvas Board 50 2026-04-08T04:10:08.480Z" [ref=e728] [cursor=pointer]:
          - generic [ref=e730]:
            - generic [ref=e731]: ⚡
            - generic [ref=e732]: Void Canvas
          - generic [ref=e733]:
            - generic "Board 50" [ref=e735]
            - generic [ref=e737]: 2026-04-08T04:10:08.480Z
        - button "⚡ Void Canvas Board 49 2026-04-08T03:59:34.907Z" [ref=e738] [cursor=pointer]:
          - generic [ref=e740]:
            - generic [ref=e741]: ⚡
            - generic [ref=e742]: Void Canvas
          - generic [ref=e743]:
            - generic "Board 49" [ref=e745]
            - generic [ref=e747]: 2026-04-08T03:59:34.907Z
        - button "⚡ Void Canvas Board 48 2026-04-08T03:58:17.758Z" [ref=e748] [cursor=pointer]:
          - generic [ref=e750]:
            - generic [ref=e751]: ⚡
            - generic [ref=e752]: Void Canvas
          - generic [ref=e753]:
            - generic "Board 48" [ref=e755]
            - generic [ref=e757]: 2026-04-08T03:58:17.758Z
        - button "⚡ Void Canvas Board 47 2026-04-08T03:48:21.185Z" [ref=e758] [cursor=pointer]:
          - generic [ref=e760]:
            - generic [ref=e761]: ⚡
            - generic [ref=e762]: Void Canvas
          - generic [ref=e763]:
            - generic "Board 47" [ref=e765]
            - generic [ref=e767]: 2026-04-08T03:48:21.185Z
        - button "⚡ Void Canvas Board 46 2026-04-08T03:47:21.648Z" [ref=e768] [cursor=pointer]:
          - generic [ref=e770]:
            - generic [ref=e771]: ⚡
            - generic [ref=e772]: Void Canvas
          - generic [ref=e773]:
            - generic "Board 46" [ref=e775]
            - generic [ref=e777]: 2026-04-08T03:47:21.648Z
        - button "⚡ Void Canvas Board 45 2026-04-08T03:46:13.238Z" [ref=e778] [cursor=pointer]:
          - generic [ref=e780]:
            - generic [ref=e781]: ⚡
            - generic [ref=e782]: Void Canvas
          - generic [ref=e783]:
            - generic "Board 45" [ref=e785]
            - generic [ref=e787]: 2026-04-08T03:46:13.238Z
        - button "⚡ Void Canvas Board 44 2026-04-08T03:45:14.007Z" [ref=e788] [cursor=pointer]:
          - generic [ref=e790]:
            - generic [ref=e791]: ⚡
            - generic [ref=e792]: Void Canvas
          - generic [ref=e793]:
            - generic "Board 44" [ref=e795]
            - generic [ref=e797]: 2026-04-08T03:45:14.007Z
        - button "⚡ Void Canvas Board 43 2026-04-08T03:44:10.591Z" [ref=e798] [cursor=pointer]:
          - generic [ref=e800]:
            - generic [ref=e801]: ⚡
            - generic [ref=e802]: Void Canvas
          - generic [ref=e803]:
            - generic "Board 43" [ref=e805]
            - generic [ref=e807]: 2026-04-08T03:44:10.591Z
        - button "⚡ Void Canvas Board 42 2026-04-08T03:43:40.916Z" [ref=e808] [cursor=pointer]:
          - generic [ref=e810]:
            - generic [ref=e811]: ⚡
            - generic [ref=e812]: Void Canvas
          - generic [ref=e813]:
            - generic "Board 42" [ref=e815]
            - generic [ref=e817]: 2026-04-08T03:43:40.916Z
        - button "⚡ Void Canvas Board 41 2026-04-08T03:42:22.642Z" [ref=e818] [cursor=pointer]:
          - generic [ref=e820]:
            - generic [ref=e821]: ⚡
            - generic [ref=e822]: Void Canvas
          - generic [ref=e823]:
            - generic "Board 41" [ref=e825]
            - generic [ref=e827]: 2026-04-08T03:42:22.642Z
        - button "⚡ Void Canvas Board 40 2026-04-08T03:41:54.492Z" [ref=e828] [cursor=pointer]:
          - generic [ref=e830]:
            - generic [ref=e831]: ⚡
            - generic [ref=e832]: Void Canvas
          - generic [ref=e833]:
            - generic "Board 40" [ref=e835]
            - generic [ref=e837]: 2026-04-08T03:41:54.492Z
        - button "⚡ Void Canvas Board 39 2026-04-08T03:40:37.356Z" [ref=e838] [cursor=pointer]:
          - generic [ref=e840]:
            - generic [ref=e841]: ⚡
            - generic [ref=e842]: Void Canvas
          - generic [ref=e843]:
            - generic "Board 39" [ref=e845]
            - generic [ref=e847]: 2026-04-08T03:40:37.356Z
        - button "⚡ Void Canvas Board 38 2026-04-08T03:40:08.572Z" [ref=e848] [cursor=pointer]:
          - generic [ref=e850]:
            - generic [ref=e851]: ⚡
            - generic [ref=e852]: Void Canvas
          - generic [ref=e853]:
            - generic "Board 38" [ref=e855]
            - generic [ref=e857]: 2026-04-08T03:40:08.572Z
        - button "⚡ Void Canvas Board 37 2026-04-08T03:39:12.702Z" [ref=e858] [cursor=pointer]:
          - generic [ref=e860]:
            - generic [ref=e861]: ⚡
            - generic [ref=e862]: Void Canvas
          - generic [ref=e863]:
            - generic "Board 37" [ref=e865]
            - generic [ref=e867]: 2026-04-08T03:39:12.702Z
        - button "⚡ Void Canvas Board 36 2026-04-08T03:38:44.685Z" [ref=e868] [cursor=pointer]:
          - generic [ref=e870]:
            - generic [ref=e871]: ⚡
            - generic [ref=e872]: Void Canvas
          - generic [ref=e873]:
            - generic "Board 36" [ref=e875]
            - generic [ref=e877]: 2026-04-08T03:38:44.685Z
        - button "⚡ Void Canvas Board 35 2026-04-08T03:37:37.747Z" [ref=e878] [cursor=pointer]:
          - generic [ref=e880]:
            - generic [ref=e881]: ⚡
            - generic [ref=e882]: Void Canvas
          - generic [ref=e883]:
            - generic "Board 35" [ref=e885]
            - generic [ref=e887]: 2026-04-08T03:37:37.747Z
        - button "⚡ Void Canvas Board 34 2026-04-08T03:37:09.503Z" [ref=e888] [cursor=pointer]:
          - generic [ref=e890]:
            - generic [ref=e891]: ⚡
            - generic [ref=e892]: Void Canvas
          - generic [ref=e893]:
            - generic "Board 34" [ref=e895]
            - generic [ref=e897]: 2026-04-08T03:37:09.503Z
        - button "⚡ Void Canvas Board 33 2026-04-08T03:36:09.846Z" [ref=e898] [cursor=pointer]:
          - generic [ref=e900]:
            - generic [ref=e901]: ⚡
            - generic [ref=e902]: Void Canvas
          - generic [ref=e903]:
            - generic "Board 33" [ref=e905]
            - generic [ref=e907]: 2026-04-08T03:36:09.846Z
        - button "⚡ Void Canvas Board 32 2026-04-08T03:36:00.978Z" [ref=e908] [cursor=pointer]:
          - generic [ref=e910]:
            - generic [ref=e911]: ⚡
            - generic [ref=e912]: Void Canvas
          - generic [ref=e913]:
            - generic "Board 32" [ref=e915]
            - generic [ref=e917]: 2026-04-08T03:36:00.978Z
        - button "⚡ Void Canvas Board 31 2026-04-08T03:35:42.356Z" [ref=e918] [cursor=pointer]:
          - generic [ref=e920]:
            - generic [ref=e921]: ⚡
            - generic [ref=e922]: Void Canvas
          - generic [ref=e923]:
            - generic "Board 31" [ref=e925]
            - generic [ref=e927]: 2026-04-08T03:35:42.356Z
        - button "⚡ Void Canvas Board 30 2026-04-08T03:35:33.313Z" [ref=e928] [cursor=pointer]:
          - generic [ref=e930]:
            - generic [ref=e931]: ⚡
            - generic [ref=e932]: Void Canvas
          - generic [ref=e933]:
            - generic "Board 30" [ref=e935]
            - generic [ref=e937]: 2026-04-08T03:35:33.313Z
        - button "⚡ Void Canvas Board 29 2026-04-08T03:34:42.616Z" [ref=e938] [cursor=pointer]:
          - generic [ref=e940]:
            - generic [ref=e941]: ⚡
            - generic [ref=e942]: Void Canvas
          - generic [ref=e943]:
            - generic "Board 29" [ref=e945]
            - generic [ref=e947]: 2026-04-08T03:34:42.616Z
        - button "⚡ Void Canvas Board 28 2026-04-08T03:34:33.503Z" [ref=e948] [cursor=pointer]:
          - generic [ref=e950]:
            - generic [ref=e951]: ⚡
            - generic [ref=e952]: Void Canvas
          - generic [ref=e953]:
            - generic "Board 28" [ref=e955]
            - generic [ref=e957]: 2026-04-08T03:34:33.503Z
        - button "⚡ Void Canvas Board 27 2026-04-08T03:34:26.896Z" [ref=e958] [cursor=pointer]:
          - generic [ref=e960]:
            - generic [ref=e961]: ⚡
            - generic [ref=e962]: Void Canvas
          - generic [ref=e963]:
            - generic "Board 27" [ref=e965]
            - generic [ref=e967]: 2026-04-08T03:34:26.896Z
        - button "⚡ Void Canvas Board 26 2026-04-08T03:34:17.485Z" [ref=e968] [cursor=pointer]:
          - generic [ref=e970]:
            - generic [ref=e971]: ⚡
            - generic [ref=e972]: Void Canvas
          - generic [ref=e973]:
            - generic "Board 26" [ref=e975]
            - generic [ref=e977]: 2026-04-08T03:34:17.485Z
        - button "⚡ Void Canvas Board 25 2026-04-08T03:28:18.212Z" [ref=e978] [cursor=pointer]:
          - generic [ref=e980]:
            - generic [ref=e981]: ⚡
            - generic [ref=e982]: Void Canvas
          - generic [ref=e983]:
            - generic "Board 25" [ref=e985]
            - generic [ref=e987]: 2026-04-08T03:28:18.212Z
        - button "⚡ Void Canvas Board 24 2026-04-08T03:27:45.094Z" [ref=e988] [cursor=pointer]:
          - generic [ref=e990]:
            - generic [ref=e991]: ⚡
            - generic [ref=e992]: Void Canvas
          - generic [ref=e993]:
            - generic "Board 24" [ref=e995]
            - generic [ref=e997]: 2026-04-08T03:27:45.094Z
        - button "⚡ Void Canvas Board 23 2026-04-08T03:27:10.609Z" [ref=e998] [cursor=pointer]:
          - generic [ref=e1000]:
            - generic [ref=e1001]: ⚡
            - generic [ref=e1002]: Void Canvas
          - generic [ref=e1003]:
            - generic "Board 23" [ref=e1005]
            - generic [ref=e1007]: 2026-04-08T03:27:10.609Z
        - button "⚡ Void Canvas Board 22 2026-04-08T03:26:56.079Z" [ref=e1008] [cursor=pointer]:
          - generic [ref=e1010]:
            - generic [ref=e1011]: ⚡
            - generic [ref=e1012]: Void Canvas
          - generic [ref=e1013]:
            - generic "Board 22" [ref=e1015]
            - generic [ref=e1017]: 2026-04-08T03:26:56.079Z
        - button "⚡ Void Canvas Board 21 2026-04-08T03:26:35.323Z" [ref=e1018] [cursor=pointer]:
          - generic [ref=e1020]:
            - generic [ref=e1021]: ⚡
            - generic [ref=e1022]: Void Canvas
          - generic [ref=e1023]:
            - generic "Board 21" [ref=e1025]
            - generic [ref=e1027]: 2026-04-08T03:26:35.323Z
        - button "⚡ Void Canvas Board 20 2026-04-08T03:26:20.532Z" [ref=e1028] [cursor=pointer]:
          - generic [ref=e1030]:
            - generic [ref=e1031]: ⚡
            - generic [ref=e1032]: Void Canvas
          - generic [ref=e1033]:
            - generic "Board 20" [ref=e1035]
            - generic [ref=e1037]: 2026-04-08T03:26:20.532Z
        - button "⚡ Void Canvas Board 19 2026-04-08T03:26:07.937Z" [ref=e1038] [cursor=pointer]:
          - generic [ref=e1040]:
            - generic [ref=e1041]: ⚡
            - generic [ref=e1042]: Void Canvas
          - generic [ref=e1043]:
            - generic "Board 19" [ref=e1045]
            - generic [ref=e1047]: 2026-04-08T03:26:07.937Z
        - button "⚡ Void Canvas Board 18 2026-04-08T03:25:49.157Z" [ref=e1048] [cursor=pointer]:
          - generic [ref=e1050]:
            - generic [ref=e1051]: ⚡
            - generic [ref=e1052]: Void Canvas
          - generic [ref=e1053]:
            - generic "Board 18" [ref=e1055]
            - generic [ref=e1057]: 2026-04-08T03:25:49.157Z
        - button "⚡ Void Canvas Board 17 2026-04-08T03:25:44.459Z" [ref=e1058] [cursor=pointer]:
          - generic [ref=e1060]:
            - generic [ref=e1061]: ⚡
            - generic [ref=e1062]: Void Canvas
          - generic [ref=e1063]:
            - generic "Board 17" [ref=e1065]
            - generic [ref=e1067]: 2026-04-08T03:25:44.459Z
        - button "⚡ Void Canvas Board 16 2026-04-08T03:25:20.787Z" [ref=e1068] [cursor=pointer]:
          - generic [ref=e1070]:
            - generic [ref=e1071]: ⚡
            - generic [ref=e1072]: Void Canvas
          - generic [ref=e1073]:
            - generic "Board 16" [ref=e1075]
            - generic [ref=e1077]: 2026-04-08T03:25:20.787Z
        - button "⚡ Void Canvas Board 15 2026-04-08T03:24:57.499Z" [ref=e1078] [cursor=pointer]:
          - generic [ref=e1080]:
            - generic [ref=e1081]: ⚡
            - generic [ref=e1082]: Void Canvas
          - generic [ref=e1083]:
            - generic "Board 15" [ref=e1085]
            - generic [ref=e1087]: 2026-04-08T03:24:57.499Z
        - button "⚡ Void Canvas Board 14 2026-04-08T03:24:44.077Z" [ref=e1088] [cursor=pointer]:
          - generic [ref=e1090]:
            - generic [ref=e1091]: ⚡
            - generic [ref=e1092]: Void Canvas
          - generic [ref=e1093]:
            - generic "Board 14" [ref=e1095]
            - generic [ref=e1097]: 2026-04-08T03:24:44.077Z
        - button "⚡ Void Canvas Board 13 2026-04-08T03:24:33.809Z" [ref=e1098] [cursor=pointer]:
          - generic [ref=e1100]:
            - generic [ref=e1101]: ⚡
            - generic [ref=e1102]: Void Canvas
          - generic [ref=e1103]:
            - generic "Board 13" [ref=e1105]
            - generic [ref=e1107]: 2026-04-08T03:24:33.809Z
        - button "⚡ Void Canvas Board 12 2026-04-08T03:24:21.667Z" [ref=e1108] [cursor=pointer]:
          - generic [ref=e1110]:
            - generic [ref=e1111]: ⚡
            - generic [ref=e1112]: Void Canvas
          - generic [ref=e1113]:
            - generic "Board 12" [ref=e1115]
            - generic [ref=e1117]: 2026-04-08T03:24:21.667Z
        - button "⚡ Void Canvas Board 11 2026-04-08T03:23:57.278Z" [ref=e1118] [cursor=pointer]:
          - generic [ref=e1120]:
            - generic [ref=e1121]: ⚡
            - generic [ref=e1122]: Void Canvas
          - generic [ref=e1123]:
            - generic "Board 11" [ref=e1125]
            - generic [ref=e1127]: 2026-04-08T03:23:57.278Z
```

# Test source

```ts
  1  | import { test, expect } from './fixtures.js';
  2  | 
  3  | test.describe('Image and Video Node Operations', () => {
  4  | 
  5  |   test('Check Nodes Availability and Visuals', async ({ editorPage: page }) => {
  6  |     // 1. CLEAR OVERLAYS - Using a loop with explicit visibility checks
  7  |     console.log("Checking for tour/onboarding overlays...");
  8  |     
  9  |     // Attempt to dismiss any tour or welcome modal
  10 |     const clearModals = async () => {
  11 |         const modals = ['text=Welcome to FS Node Project!', 'text=Skip Tour', 'text=Next'];
  12 |         for (const selector of modals) {
  13 |             const loc = page.locator(selector).first();
  14 |             if (await loc.isVisible()) {
  15 |                 console.log(`Clearing overlay: ${selector}`);
  16 |                 if (selector.includes('Skip Tour')) {
  17 |                     await loc.click({ force: true });
  18 |                 } else {
  19 |                     await page.keyboard.press('Escape');
  20 |                 }
  21 |                 await page.waitForTimeout(500);
  22 |             }
  23 |         }
  24 |     };
  25 | 
  26 |     await clearModals();
  27 |     await page.waitForTimeout(1000);
  28 |     // Double check
  29 |     await clearModals();
  30 | 
  31 |     // 2. WAIT FOR ACTIONABLE CANVAS
  32 |     const pane = page.locator('.react-flow__pane');
  33 |     await expect(pane).toBeVisible({ timeout: 30000 });
  34 |     
  35 |     // Ensure it's truly visible (not obscured)
  36 |     await pane.click({ force: true, position: { x: 50, y: 50 } });
  37 | 
  38 |     const nodesToTest = [
  39 |         { type: 'imageNode', label: 'Image', expectedText: 'UPLOAD' },
  40 |         { type: 'videoOutput', label: 'Video Output', expectedText: 'No video connected' },
  41 |         { type: 'universalGeneratorImage', label: 'Universal Image Generator', expectedText: 'Image Generation' }
  42 |     ];
  43 | 
  44 |     for (const node of nodesToTest) {
  45 |         console.log(`Testing node: ${node.type}`);
  46 |         
  47 |         // Ensure menu is closed first
  48 |         await page.keyboard.press('Escape');
  49 |         await page.waitForTimeout(200);
  50 | 
  51 |         // Open search menu - establish focus then hit space
  52 |         await page.keyboard.press(' ');
  53 |         
  54 |         const searchInput = page.locator('.ms-search-input-overlay');
  55 |         await expect(searchInput).toBeVisible({ timeout: 15000 });
  56 |         
  57 |         // Type the node type
  58 |         await searchInput.fill(node.type);
  59 |         await page.waitForTimeout(1000);
  60 |         
  61 |         // Click the result - find the one that matches or the first one if we must
  62 |         await page.evaluate((type) => {
  63 |             const btns = Array.from(document.querySelectorAll('.ms-node-list button.ms-node-btn'));
  64 |             const target = btns.find(b => 
  65 |                 b.textContent.toLowerCase().includes(type.toLowerCase()) || 
  66 |                 b.getAttribute('data-node-type') === type
  67 |             );
  68 |             if (target) {
  69 |                 console.log(`Found button for ${type}, clicking.`);
  70 |                 target.click();
  71 |             } else if (btns.length > 0) {
  72 |                 console.log(`Button for ${type} not found, clicking first available.`);
  73 |                 btns[0].click();
  74 |             }
  75 |         }, node.type);
  76 |         
  77 |         // Check if node appeared
  78 |         const canvasNode = page.locator(`.react-flow__node-${node.type}`).first();
> 79 |         await expect(canvasNode).toBeVisible({ timeout: 20000 });
     |                                  ^ Error: expect(locator).toBeVisible() failed
  80 |         
  81 |         // Verification screenshot - take it before potentially failing on characteristic text
  82 |         await page.screenshot({ path: `tests/e2e/screenshots/node_${node.type}.png` });
  83 | 
  84 |         // Lenient verification of characteristic text
  85 |         if (node.expectedText) {
  86 |             const characteristic = canvasNode.locator(`text=${node.expectedText}`).first();
  87 |             const exists = await characteristic.count() > 0;
  88 |             console.log(`Node ${node.type} characteristic text '${node.expectedText}' exists: ${exists}`);
  89 |         }
  90 |         
  91 |         // Clean up
  92 |         await canvasNode.click({ force: true });
  93 |         await page.keyboard.press('Backspace');
  94 |         await page.waitForTimeout(500);
  95 |     }
  96 |   });
  97 | });
  98 | 
```