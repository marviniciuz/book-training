const { jsPDF } = window.jspdf;
const app = Vue.createApp({
    data() {
        return {
            qtd: 0,
            exercicios: []
        };
    },
    methods: {
        criarExercicios() {
            this.exercicios = [];
            for (let i = 0; i < this.qtd; i++) {
                this.exercicios.push({ nome: '', series: [] });
            }
        },
        adicionarSerie(index) {
            this.exercicios[index].series.push({
                tipo: 'Aquecimento',
                reps: '',
                obs: ''
            });
        },
        gerarPDF() {
            const doc = new jsPDF();
            let y = 10;
            doc.setFontSize(16);
            doc.text('Treino Gerado', 10, y);
            y += 10;
            doc.setFontSize(12);
            this.exercicios.forEach((ex, idx) => {
                doc.text(`Exercício ${idx + 1}: ${ex.nome}`, 10, y);
                y += 7;
                ex.series.forEach((s, i) => {
                    doc.text(`Série ${i + 1} - ${s.tipo} - ${s.reps} - ${s.obs}`, 14, y);
                    y += 6;
                });
                y += 4;
            });
            doc.save('treino.pdf');
        }
    }
});
app.mount('#app');