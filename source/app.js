// Extrai o objeto jsPDF da janela global
const { jsPDF } = window.jspdf;

// Cria o aplicativo Vue
const app = Vue.createApp({
    data() {
        return {
            qtd: 1, // Começa com 1 como quantidade padrão
            exercicios: []
        };
    },
    methods: {
        criarExercicios() {
            // Garante que a quantidade seja um número positivo
            const count = Math.max(1, parseInt(this.qtd) || 1);
            this.exercicios = [];
            for (let i = 0; i < count; i++) {
                this.exercicios.push({ nome: '', series: [] });
            }
        },
        adicionarSerie(index) {
            this.exercicios[index].series.push({
                tipo: 'Trabalho',
                carga: '', // Carga em kg/lb
                reps: '', // Repetições/Tempo
                obs: '' // Observações
            });
        },
        removerExercicio(index) {
            this.exercicios.splice(index, 1);
        },
        removerSerie(exIndex, serieIndex) {
            this.exercicios[exIndex].series.splice(serieIndex, 1);
        },
        gerarPDF() {
            const doc = new jsPDF();
            let y = 10;
            
            // Título Principal
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.text('Plano de Treino Personalizado', 105, y, { align: 'center' });
            y += 10;
            
            // Data de Geração
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 105, y, { align: 'center' });
            y += 10;

            this.exercicios.forEach((ex, idx) => {
                // Se o exercício tem nome, usa. Senão, usa um placeholder.
                const exName = ex.nome.trim() || `[Exercício ${idx + 1} Sem Nome]`;
                
                // Quebra de página se necessário
                if (y > 280) {
                    doc.addPage();
                    y = 10;
                }

                // Nome do Exercício
                doc.setFont("helvetica", "bold");
                doc.setFontSize(14);
                doc.text(`🏋️ EXERCÍCIO ${idx + 1}: ${exName.toUpperCase()}`, 10, y);
                y += 5;
                
                // Linha Separadora
                doc.setDrawColor(200, 200, 200);
                doc.line(10, y, 200, y);
                y += 4;
                
                // Cabeçalho da Tabela
                doc.setFontSize(10);
                doc.setFont("helvetica", "bold");
                doc.text("Tipo", 12, y);
                doc.text("Carga (kg)", 50, y);
                doc.text("Reps/Tempo", 90, y);
                doc.text("Observações", 130, y);
                y += 5;
                
                doc.setFont("helvetica", "normal");
                ex.series.forEach((s) => {
                    // Conteúdo da Série
                    if (y > 280) {
                        doc.addPage();
                        y = 10;
                        doc.setFontSize(10);
                        doc.setFont("helvetica", "bold");
                        doc.text("Tipo", 12, y);
                        doc.text("Carga (kg)", 50, y);
                        doc.text("Reps/Tempo", 90, y);
                        doc.text("Observações", 130, y);
                        y += 5;
                        doc.setFont("helvetica", "normal");
                    }
                    
                    doc.text(s.tipo || '-', 12, y);
                    doc.text(s.carga || '-', 50, y);
                    doc.text(s.reps || '-', 90, y);
                    
                    // Adiciona observações com quebra de linha
                    // O valor '65' é a largura máxima da coluna em mm
                    const obsLines = doc.splitTextToSize(s.obs || '-', 65);
                    doc.text(obsLines, 130, y);
                    
                    // Ajusta o 'y' para a próxima linha baseando-se no maior conteúdo (as observações)
                    y += (obsLines.length * 4) + 2; 
                });
                
                // Espaçamento entre Exercícios
                y += 5;
                doc.line(10, y, 200, y); // Linha final do Exercício
                y += 5;
            });
            
            doc.save('plano_de_treino.pdf');
        }
    }
});

// Monta o aplicativo Vue no elemento com id="app"
app.mount('#app');