'use client';

import { motion } from 'framer-motion';
import { a } from 'framer-motion/client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      {/* Hero Section */}
      <header className="w-full bg-gradient-to-r from-blue-700 to-purple-700 text-white py-20 text-center shadow-lg">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold"
        >
          Transforme Seu Negócio com Automação Inteligente
        </motion.h1>
        <p className="mt-4 text-lg opacity-80">Soluções inovadoras para otimizar seus processos e aumentar sua produtividade.</p>
      </header>
      
      {/* Serviços */}
      <section className="py-20 max-w-5xl text-center">
        <h2 className="text-4xl font-bold text-blue-400">Nossos Serviços</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {['Automação Inteligente', 'Otimização de Processos', 'Integrações Personalizadas', 'Gestão de Dados', 'Segurança Digital'].map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-6 bg-gray-800 text-white shadow-lg rounded-xl border border-gray-700 hover:border-blue-400 hover:shadow-2xl"
            >
              <h3 className="text-xl font-semibold text-blue-300">{service}</h3>
              <p className="mt-2 opacity-80">Soluções personalizadas para maximizar sua produtividade e segurança.</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Benefícios */}
      <section className="bg-gradient-to-r from-purple-700 to-blue-700 text-white py-16 w-full text-center shadow-lg">
        <h2 className="text-4xl font-bold">Por que Automatizar?</h2>
        <p className="mt-4 max-w-3xl mx-auto opacity-90">Reduza custos, elimine tarefas repetitivas, melhore a segurança digital e foque no crescimento do seu negócio.</p>
      </section>
      
      {/* Depoimentos */}
      <section className="py-16 text-center max-w-5xl">
        <h2 className="text-4xl font-bold text-blue-400">O Que Nossos Clientes Dizem</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {["A automação aumentou nossa produtividade", "A integração personalizada otimizou nossos processos e reduziu custos"].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3 }}
              className="p-6 bg-gray-800 text-white rounded-xl border border-gray-700 hover:border-blue-400 hover:shadow-2xl"
            >
              <p className="italic">"{testimonial}"</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Chamada Final */}
      <footer className="py-16 text-center">
        <h2 className="text-2xl font-bold text-blue-300">Pronto para transformar sua empresa?</h2>
        <p className="mt-2 opacity-80">Entre em contato e descubra como podemos ajudar.</p>
        <div className="mt-6 flex flex-col gap-4">
          <motion.a 
            whileHover={{ scale: 1.1 }}
            href="https://wa.me/5516997718996"
            target="_blank"
            className="bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-green-400"
          >
            Fale Conosco pelo WhatsApp
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.05 }}
            href="mailto:roberto@zapchatbr.com"
            className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-blue-500"
          >
            Email: Roberto
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.05 }}
            href="mailto:rafaelcarvalho@zapchatbr.com"
            className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-blue-500"
          >
            Email: Rafael
          </motion.a>
        </div>
      </footer>
    </div>
  );
}
