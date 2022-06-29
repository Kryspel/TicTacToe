function Info(){
  function toogleTheme(){
    document.querySelector('#root')
      .classList.toggle('light')
  }
  return (
    <article>
      <h1> Kółko i Krzyżyk </h1>
      <p>
        Prawdopodobnie najbardziej hardcorowa gra strategiczna
        z jaką kiedykolwiek miałeś/aś do czynienia.
      </p><p>
        W tej odsłonie masz szansę zmierzyć się z botem, czyli
        kombinacją zer i jedynek, które już są w pamięci RAM
        Twojego komputera!
      </p><p>
        Zakładam, że znasz zasady. Życzę powodzenia!
      </p><br/><p>
        PS. Autor nie ponosi odpowiedzialności za szkody wynikłe
        w wyniku niekontrolowanych reakcji emocjonalnych
        wywołanych frustracją po niepomyślnym zakończeniu
        rozgrywki.
      </p>
      <span onClick = {toogleTheme}>
        Kliknij mnie, aby zmienić motyw
      </span>
    </article>
  )
}
function GameField(props){
  const {
    className,
    onClick,
    char,
    id
  } = props
  return (
    <div
      className = {`field ${className}`}
      id = {id}
      onClick = {onClick}
    >
      { char && <img src = {`./KiK/${char}.svg`} />}
    </div>
  )
}

class Board extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      fields: {
        A0: { char: null, win: '' },
        A1: { char: null, win: '' },
        A2: { char: null, win: '' },
        B0: { char: null, win: '' },
        B1: { char: null, win: '' },
        B2: { char: null, win: '' },
        C0: { char: null, win: '' },
        C1: { char: null, win: '' },
        C2: { char: null, win: '' }
      }
    }
    this.stop = false
    this.endGame = false
  }
  componentDidMount(){
    if (parseInt(Math.random() * 2))
      setTimeout(() => this.botMove(), 500)
  }
  componentDidUpdate(){
    const f = {...this.state.fields}
    const chars = Object.keys(f).map(k => f[k].char)
    const sameFields = []
    if (f.A0.char == f.A1.char && f.A1.char == f.A2.char && f.A1.char)
      sameFields.push('A0', 'A1', 'A2')
    if (f.B0.char == f.B1.char && f.B1.char == f.B2.char && f.B1.char)
      sameFields.push('B0', 'B1', 'B2')
    if (f.C0.char == f.C1.char && f.C1.char == f.C2.char && f.C1.char)
      sameFields.push('C0', 'C1', 'C2')

    if (f.A0.char == f.B0.char && f.B0.char == f.C0.char && f.B0.char)
      sameFields.push('A0', 'B0', 'C0')
    if (f.A1.char == f.B1.char && f.B1.char == f.C1.char && f.B1.char)
      sameFields.push('A1', 'B1', 'C1')
    if (f.A2.char == f.B2.char && f.B2.char == f.C2.char && f.B2.char)
      sameFields.push('A2', 'B2', 'C2')

    if (f.A0.char == f.B1.char && f.B1.char == f.C2.char && f.B1.char)
      sameFields.push('A0', 'B1', 'C2')
    if (f.A2.char == f.B1.char && f.B1.char == f.C0.char && f.B1.char)
      sameFields.push('A2', 'B1', 'C0')

    if (!sameFields.length && chars.every(e => e))
      sameFields.push(...Object.keys(f))

    if (sameFields.length && !this.endGame){
      this.stop = true
      this.endGame = true
      new Set(sameFields).forEach(k => f[k].win = 'end')
      this.setState({ fields: {...f} })

      setTimeout(() => {
        this.setState({ fields: {
          A0: { char: null, win: '' },
          A1: { char: null, win: '' },
          A2: { char: null, win: '' },
          B0: { char: null, win: '' },
          B1: { char: null, win: '' },
          B2: { char: null, win: '' },
          C0: { char: null, win: '' },
          C1: { char: null, win: '' },
          C2: { char: null, win: '' }
        }})
        this.endGame = false
        if (parseInt(Math.random() * 2))
          setTimeout(() => this.botMove(), 300)
        else
          this.stop = false
      }, 1500)
    }
  }

  playerMove(e){
    const id = e.target.id
    const newFields = {...this.state.fields}
    if (this.stop || this.endGame || id == '' || newFields[id].char){
      return
    }
    newFields[id].char = 'x'
    this.setState({ fields: newFields })
    this.stop = true
    setTimeout(() => this.botMove(), 300)
  }
  botMove(){
    if (this.endGame) return
    const newFields = {...this.state.fields}
    const randomIndex = parseInt(Math.random() * 9)
    const random = Object.keys(newFields)[randomIndex]
    if (newFields[random].char){
      this.botMove()
      return
    }
    newFields[random].char = 'o'
    this.setState({ fields: newFields })
    this.stop = false
  }

  render(){
    return (
      <main>{
        Object.keys(this.state.fields).map(k => (
          <GameField
            id = {k}
            key = {k}
            className = {this.state.fields[k].win}
            onClick = {e => this.playerMove(e)}
            char = { this.state.fields[k].char }
          />
        ))
      }</main>
    )
  }
}
function App(){
  return (
    <>
      <section> <Info /> </section>
      <section> <Board /> </section>
    </>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'));
