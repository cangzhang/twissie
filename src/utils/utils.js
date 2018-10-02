import day from 'dayjs'

export const getAvatarUrl = url => (url || '').replace('_normal.', '.')

const DATE_FORMAT = 'YYYY-M-DD HH:mm:ss'
export const getDisplayTime = time => day(time).format(DATE_FORMAT)