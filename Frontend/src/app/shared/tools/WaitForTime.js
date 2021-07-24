export const waitForTime = (ms) => {
  return new Promise((r) => setTimeout(r, ms))
}

export const syncWaitForTime = ms => {
  const end = Date.now() + ms
  while (Date.now() < end) continue
}