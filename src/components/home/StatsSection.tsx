
const StatsSection = () => {
  const stats = [
    { number: "15", label: "Anos no Mercado" },
    { number: "2.5k+", label: "Clientes Cadastrados" },
    { number: "8.2k+", label: "Produtos Manipulados" },
    { number: "96%", label: "Satisfação dos Usuários" }
  ];

  return (
    <section className="py-16 bg-green-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-green-100 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
