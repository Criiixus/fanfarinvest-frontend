import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/investimentos'

function App() {
  const [investimentos, setInvestimentos] = useState([])
  const [form, setForm] = useState({
    nome: '',
    tipo: '',
    rentabilidade: '',
    risco: '',
    minimo_aporte: ''
  })
  const [editandoId, setEditandoId] = useState(null)

  useEffect(() => {
    carregarInvestimentos()
  }, [])

  async function carregarInvestimentos() {
    try {
      const res = await axios.get(API_URL)
      setInvestimentos(res.data)
    } catch (error) {
      alert('Erro ao carregar investimentos')
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const dados = {
        ...form,
        rentabilidade: parseFloat(form.rentabilidade),
        minimo_aporte: parseFloat(form.minimo_aporte)
      }
      if (editandoId) {
        await axios.put(`${API_URL}/${editandoId}`, dados, {
          headers: { 'Content-Type': 'application/json' }
        })
        setEditandoId(null)
      } else {
        await axios.post(API_URL, dados, {
          headers: { 'Content-Type': 'application/json' }
        })
      }
      setForm({
        nome: '',
        tipo: '',
        rentabilidade: '',
        risco: '',
        minimo_aporte: ''
      })
      carregarInvestimentos()
    } catch (error) {
      alert('Erro ao salvar investimento')
    }
  }

  function editar(investimento) {
    setForm({
      nome: investimento.nome,
      tipo: investimento.tipo,
      rentabilidade: investimento.rentabilidade.toString(),
      risco: investimento.risco,
      minimo_aporte: investimento.minimo_aporte.toString()
    })
    setEditandoId(investimento.id)
  }

  async function deletar(id) {
    if (window.confirm('Deseja realmente deletar este investimento?')) {
      try {
        await axios.delete(`${API_URL}/${id}`)
        carregarInvestimentos()
      } catch {
        alert('Erro ao deletar investimento')
      }
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h1>FanfarInvest</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Nome"
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <input
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          placeholder="Tipo"
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <input
          name="rentabilidade"
          type="number"
          step="0.01"
          value={form.rentabilidade}
          onChange={handleChange}
          placeholder="Rentabilidade (%)"
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <input
          name="risco"
          value={form.risco}
          onChange={handleChange}
          placeholder="Risco"
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <input
          name="minimo_aporte"
          type="number"
          step="0.01"
          value={form.minimo_aporte}
          onChange={handleChange}
          placeholder="Aporte Mínimo"
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button type="submit" style={{ padding: '10px 15px' }}>
          {editandoId ? 'Atualizar' : 'Cadastrar'}
        </button>
      </form>

      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Rentabilidade</th>
            <th>Risco</th>
            <th>Aporte Mínimo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {investimentos.map(inv => (
            <tr key={inv.id}>
              <td>{inv.nome}</td>
              <td>{inv.tipo}</td>
              <td>{inv.rentabilidade}%</td>
              <td>{inv.risco}</td>
              <td>R$ {inv.minimo_aporte}</td>
              <td>
                <button onClick={() => editar(inv)} style={{ marginRight: 5 }}>Editar</button>
                <button onClick={() => deletar(inv.id)}>Deletar</button>
              </td>
            </tr>
          ))}
          {investimentos.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>Nenhum investimento cadastrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default App
