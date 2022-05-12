let maxMatch = (A) => {
  let noUse = new Map() // 集合 A 中的顶点已匹配的 B 集合中的顶点
  let matchList = new Map() // A/B 集合已经匹配边

  // 递归匹配
  let matchFun = (key, value, path) => {
    let isMatch = false
    // 遍历循环 key 顶点的相邻顶点（value），若存在未匹配，则为 key 顶点的匹配边，设置 isMatch=true
    for (let i = 0; i < value.length; i++) {
      if (!noUse.get(value[i])) {
        // 查询到有未匹配边，停止循环，找到匹配边
        matchList.set(key, value[i])
        noUse.set(value[i], key)

        let keys = [...path.keys()]
        for (let j = path.size; j > 0; j--) {
          matchList.set(keys[j - 1], path.get(keys[j - 1]))
          noUse.set(path.get(keys[j - 1]), keys[j - 1])
        }

        isMatch = true
        break
      }
    }

    // 若 key 顶点的相邻顶点（value）中都已经被占用，则根据 path 路径回溯查找
    if (!isMatch) {
      if (path.get(key)) return false
      path.set(key, value[0])

      let keyn = noUse.get(value[0])
      let valuen = A.get(keyn)

      let index = valuen.indexOf(value[0])
      if (index > -1) valuen.splice(index, 1)

      valuen.length > 0 && matchFun(keyn, valuen, path)
    }
  }

  // 循环遍历 A 集合中每个顶点
  for (let [key, value] of A) {
    // 记录匹配路径，用于回溯查找
    let p = new Map()
    // key 顶点存在相邻顶点，即进行匹配
    value.length > 0 && matchFun(key, value, p)
  }

  return matchList.size
}

function domino(n, m, broken) {
  // 将破损数组重新排列，转化成 i&j 的形式，方便后面进行筛选
  let tranBroken = new Set()

  broken.forEach((item) => {
    tranBroken.add(`${item[0]}&${item[1]}`)
  })

  // 通过循环将数组拆分成 A，B 两个集合
  let A = new Map() // i+j == 偶数
  let B = new Map() // i+j == 奇数
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (tranBroken.has(`${i}&${j}`)) continue // 若当前格子是破损的，则跳过；

      let gather = (i + j) % 2 == 0 ? A : B

      gather.set(`${i}&${j}`, [])

      // 判断格子四周是否可进行连接的边，放置骨牌，计算时要注意边界值
      if (!tranBroken.has(`${i - 1}&${j}`) && i > 0) {
        gather.get(`${i}&${j}`).push(`${i - 1}&${j}`)
      }

      if (!tranBroken.has(`${i}&${j - 1}`) && j > 0) {
        gather.get(`${i}&${j}`).push(`${i}&${j - 1}`)
      }
      if (!tranBroken.has(`${i + 1}&${j}`) && i + 1 < n) {
        gather.get(`${i}&${j}`).push(`${i + 1}&${j}`)
      }

      if (!tranBroken.has(`${i}&${j + 1}`) && j + 1 < m) {
        gather.get(`${i}&${j}`).push(`${i}&${j + 1}`)
      }
    }
  }
  // 取 集合A/B最大匹配的最大值
  let size = Math.max(maxMatch(A), maxMatch(B))

  return size
}
// ----------------=======------------
const N = 510
let head = new Array(N).fill(-1)
let edge = []
let next = []
let idx = 0

let add = (a, b) => {
  edge[idx] = b
  next[idx] = head[a]
  head[a] = idx++
}

let st = new Int32Array(N) //该右边点是否被考虑匹配
let match = new Int32Array(N) //与右边集合点匹配的左边集合点  match[2] = 3; 左3右2匹配
let find = (lpoint) => {
  //左边集合点
  for (let i = head[lpoint]; i !== -1; i = next[i]) {
    //遍历与lpoint相连的右边集合点
    let j = edge[i]
    if (!st[j]) {
      // 该右边点未被考虑过
      st[j]++
      if (match[j] === 0 || find(match[j])) {
        //该右边点未匹配 或者  与该右边点匹配的左边点能（且已经）与其他右边点匹配
        match[j] = lpoint
        return true
      }
    }
  }
  return false
}

let n1 = 0,
  n2 = 0,
  m = 0

let buf = ''
process.stdin.on('readable', function () {
  let chunk = process.stdin.read()
  if (chunk) buf += chunk.toString()
})
let getInputNums = (line) =>
  line
    .split(' ')
    .filter((s) => s !== '')
    .map((x) => parseInt(x))
let getInputStr = (line) => line.split(' ').filter((s) => s !== '')
process.stdin.on('end', function () {
  buf.split('\n').forEach(function (line, lineIdx) {
    if (lineIdx === 0) {
      n1 = getInputNums(line)[0]
      n2 = getInputNums(line)[1]
      m = getInputNums(line)[2]
    } else if (lineIdx <= m) {
      let arr = getInputNums(line)
      let a = arr[0]
      let b = arr[1]
      add(a, b)
      if (lineIdx === m) {
        let res = 0
        for (let i = 1; i <= n1; i++) {
          st.fill(0)
          if (find(i)) res++
        }
        console.log(res)
      }
    }
  })
})
