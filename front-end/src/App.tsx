import { FiTrash } from "react-icons/fi"
import { api } from "./services/api"
import { useEffect, useState, useRef, FormEvent } from "react"

interface CustomerProps{
  id: string;
  name: string;
  email: string;
  status: boolean;
}

export default function App() {

  const [customers, setCustomers] = useState<CustomerProps[]>([])
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    loadCostumer();
  },[])

  async function loadCostumer() {
    const response = await api.get("/customers")
    setCustomers(response.data)
  }

  async function handleSubmit(e:FormEvent) {
    e.preventDefault();
    if(!nameRef.current?.value ||  !emailRef.current?.value) return;
    const response = await api.post("/customer", {
      name: nameRef.current?.value,
      email: emailRef.current?.value
    })
    setCustomers(allCostumers => [...allCostumers, response.data])

    nameRef.current.value = ""
    emailRef.current.value = ""
  }
  async function handleDelete(id: string) {
    try{
      await api.delete("/customer", {
        params:{
          id: id,
        }
      })
      const allCostumers = customers.filter((customer) => customer.id !== id)
      setCustomers(allCostumers) 
    } catch(error){
      console.log(error)
    }
  }

  return (
    <>
      <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
        <main className="my-10 w-full md:max-w-2xl">
          <h1 className="text-3xl font-medium  text-white">Clientes</h1>
          <form action="" className="flex flex-col my-6" onSubmit={handleSubmit}>
            <label className="font-medium text-white" htmlFor=""> Nome: </label>
            <input className="w-full mb-5 p-2 rounded" ref={nameRef} type="text" placeholder="Digite o seu nome: "/>
            <label className="font-medium text-white" htmlFor=""> Email: </label>
            <input className="w-full mb-5 p-2 rounded" ref={emailRef} type="text" placeholder="Digite o seu email: "/>
            <input type="submit" className="cursor-pointer w-full p-2 bg-sky-700 rounded font-medium" value="Cadastrar Usuário" />
          </form>
          <section className="flex flex-col gap-4">
            {customers.map((customer) => (
              <article key={customer.id} className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200">
                <p className="font-medium"><span>Nome: </span><span>{customer.name}</span></p>
                <p className="font-medium"><span>Email: </span><span>{customer.email}</span></p>
                <p className="font-medium"><span>Status: </span><span>{customer.status ? "ativo" : "inativo"}</span></p>
                <button onClick={() => handleDelete(customer.id)} className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2"><FiTrash size={18} color="#fff"/></button>
              </article>
            ))}
          </section>
        </main>
      </div>
    </>
  )
}

