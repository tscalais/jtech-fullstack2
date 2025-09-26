export interface Tarefa {
  id: number
  listaId: number
  titulo: string
  concluida: boolean
  criadaEm: number
}

export interface Lista {
  id: number
  nome: string
  criadaEm: number
}
