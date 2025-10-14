/**
 * Utilitários para manipulação de localStorage e sessionStorage
 * com suporte a tipos e serialização JSON
 */

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user_data'

// ========== localStorage ==========

/**
 * Salva um item no localStorage
 */
export function setItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
  } catch (error) {
    console.error(`Erro ao salvar item "${key}" no localStorage:`, error)
  }
}

/**
 * Recupera um item do localStorage
 */
export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key)
    if (!item) return null
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Erro ao recuperar item "${key}" do localStorage:`, error)
    return null
  }
}

/**
 * Remove um item do localStorage
 */
export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Erro ao remover item "${key}" do localStorage:`, error)
  }
}

/**
 * Limpa todo o localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Erro ao limpar localStorage:', error)
  }
}

// ========== sessionStorage ==========

/**
 * Salva um item no sessionStorage
 */
export function setSessionItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value)
    sessionStorage.setItem(key, serialized)
  } catch (error) {
    console.error(`Erro ao salvar item "${key}" no sessionStorage:`, error)
  }
}

/**
 * Recupera um item do sessionStorage
 */
export function getSessionItem<T>(key: string): T | null {
  try {
    const item = sessionStorage.getItem(key)
    if (!item) return null
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Erro ao recuperar item "${key}" do sessionStorage:`, error)
    return null
  }
}

/**
 * Remove um item do sessionStorage
 */
export function removeSessionItem(key: string): void {
  try {
    sessionStorage.removeItem(key)
  } catch (error) {
    console.error(`Erro ao remover item "${key}" do sessionStorage:`, error)
  }
}

// ========== Helpers específicos para Auth ==========

/**
 * Salva o token de autenticação
 */
export function saveToken(token: string): void {
  setItem(TOKEN_KEY, token)
}

/**
 * Recupera o token de autenticação
 */
export function getToken(): string | null {
  return getItem<string>(TOKEN_KEY)
}

/**
 * Remove o token de autenticação
 */
export function removeToken(): void {
  removeItem(TOKEN_KEY)
}

/**
 * Salva o refresh token
 */
export function saveRefreshToken(refreshToken: string): void {
  setItem(REFRESH_TOKEN_KEY, refreshToken)
}

/**
 * Recupera o refresh token
 */
export function getRefreshToken(): string | null {
  return getItem<string>(REFRESH_TOKEN_KEY)
}

/**
 * Remove o refresh token
 */
export function removeRefreshToken(): void {
  removeItem(REFRESH_TOKEN_KEY)
}

/**
 * Salva os dados do usuário
 */
export function saveUser<T>(user: T): void {
  setItem(USER_KEY, user)
}

/**
 * Recupera os dados do usuário
 */
export function getUser<T>(): T | null {
  return getItem<T>(USER_KEY)
}

/**
 * Remove os dados do usuário
 */
export function removeUser(): void {
  removeItem(USER_KEY)
}

/**
 * Remove todos os dados de autenticação
 */
export function clearAuthData(): void {
  removeToken()
  removeRefreshToken()
  removeUser()
}

// ========== Helpers para verificação de Token JWT ==========

/**
 * Decodifica um token JWT (apenas a parte do payload)
 * Nota: Não valida a assinatura, apenas decodifica
 */
export function decodeJWT<T = any>(token: string): T | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = parts[1]
    const decoded = atob(payload)
    return JSON.parse(decoded) as T
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error)
    return null
  }
}

/**
 * Verifica se o token JWT está expirado
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeJWT<{ exp: number }>(token)
    if (!decoded || !decoded.exp) return true

    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
  } catch (error) {
    console.error('Erro ao verificar expiração do token:', error)
    return true
  }
}

/**
 * Retorna o tempo restante (em segundos) até o token expirar
 */
export function getTokenRemainingTime(token: string): number {
  try {
    const decoded = decodeJWT<{ exp: number }>(token)
    if (!decoded || !decoded.exp) return 0

    const currentTime = Math.floor(Date.now() / 1000)
    const remaining = decoded.exp - currentTime
    return remaining > 0 ? remaining : 0
  } catch (error) {
    console.error('Erro ao calcular tempo restante do token:', error)
    return 0
  }
}
