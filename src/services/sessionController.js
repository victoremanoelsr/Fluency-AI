/**
 * Fluency AI - Controlador de Sessão e Ciclo da Aula Diária (30 min) & Exames Práticos
 * Orquestra as 3 fases pedagógicas do Método Natural:
 * 1. Input Compreensível (10 min)
 * 2. Prática Ativa (15 min)
 * 3. Relatório & Feedback (5 min)
 */

export class SessionController {
  constructor({ node, userProfile, onPhaseChange, onTimeTick, onExamFinish }) {
    this.node = node;
    this.userProfile = userProfile || { name: 'Victor', level: 'A1' };
    this.isExam = node.nodeType === 'exam';
    
    // Initial phase
    this.currentPhase = this.isExam ? 'EXAM_ROLEPLAY' : 'PHASE_1_INPUT';
    this.secondsElapsed = 0;
    this.turnsCount = 0;
    this.userTurnCount = 0;
    this.recastCount = 0;
    this.history = [];
    
    this.onPhaseChange = onPhaseChange;
    this.onTimeTick = onTimeTick;
    this.onExamFinish = onExamFinish;
    this.timer = null;
  }

  start() {
    this.timer = setInterval(() => {
      this.secondsElapsed += 1;
      if (this.onTimeTick) {
        this.onTimeTick(this.secondsElapsed);
      }
      this.evaluateTimeTransitions();
    }, 1000);
  }

  evaluateTimeTransitions() {
    if (this.isExam) {
      // Exame não depende estritamente do relógio, mas sim do limite de 10 turnos
      return;
    }

    // Aos 10 minutos (600s) -> Transição automática para Prática Ativa
    if (this.secondsElapsed >= 600 && this.currentPhase === 'PHASE_1_INPUT') {
      this.transitionTo('PHASE_2_PRACTICE');
    }

    // Aos 25 minutos (1500s) -> Transição para Feedback Final
    if (this.secondsElapsed >= 1500 && this.currentPhase === 'PHASE_2_PRACTICE') {
      this.transitionTo('PHASE_3_FEEDBACK');
    }
  }

  transitionTo(newPhase) {
    this.currentPhase = newPhase;
    if (this.onPhaseChange) {
      this.onPhaseChange(newPhase);
    }
  }

  /**
   * Registra um turno de fala do usuário
   */
  registerUserTurn(userText) {
    this.turnsCount += 1;
    this.userTurnCount += 1;

    // Se for aula regular e o aluno tiver feito 3+ interações na Fase 1, pode antecipar a Fase 2 se desejar
    if (!this.isExam && this.currentPhase === 'PHASE_1_INPUT' && this.userTurnCount >= 2) {
      this.transitionTo('PHASE_2_PRACTICE');
    }

    // Se for Exame de 10 turnos
    if (this.isExam && this.userTurnCount >= (this.node.examConfig?.maxTurns || 10)) {
      this.currentPhase = 'EXAM_EVALUATING';
      if (this.onPhaseChange) {
        this.onPhaseChange('EXAM_EVALUATING');
      }
    }

    return {
      phase: this.currentPhase,
      userTurnCount: this.userTurnCount,
      secondsElapsed: this.secondsElapsed,
      isExamFinished: this.isExam && this.userTurnCount >= (this.node.examConfig?.maxTurns || 10)
    };
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
