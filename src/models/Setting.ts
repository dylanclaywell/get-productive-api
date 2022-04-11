import datastore from '../datastore'

export type Theme = 'light' | 'dark'

export default class Setting {
  static isValidTheme(theme: string): theme is Theme {
    return ['dark', 'light'].includes(theme)
  }

  static async setTheme(uid: string, theme: Theme) {
    await datastore.save({
      key: datastore.key(['theme', uid]),
      data: {
        theme,
      },
    })
  }
}
