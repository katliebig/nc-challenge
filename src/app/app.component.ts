import { Component, OnInit, AfterViewInit } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  ngOnInit(): void {
    if (Number(localStorage.getItem('date'))) {
      this.date = new Date(Number(localStorage.getItem('date')))
    }
  }
  ngAfterViewInit() {
    if (this.title)
      this.fitText(document.querySelector('#title') as HTMLElement)
    if (this.date) {
      this.getCountdown()
      setTimeout(
        () => this.fitText(document.querySelector('#date') as HTMLElement),
        500,
      )
    }
  }

  title = localStorage.getItem('title')
  date: Date | null = null
  tomorrow = new Date().getTime() + 1000 * 60 * 60 * 24

  fitText(el: HTMLElement) {
    el.style.fontSize = '1vw'
    const elWidth = el.getBoundingClientRect().width
    if (elWidth < window.innerWidth) {
      el.style.fontSize = `${(window.innerWidth - 60) / elWidth}vw`
    }
  }

  onTitleInput(event: Event) {
    const input = event.target as HTMLInputElement
    this.title = input.value
    localStorage.setItem('title', this.title)
    setTimeout(() => {
      const el = document.querySelector('#title')
      if (el) this.fitText(el as HTMLElement)
    }, 10)
  }

  onDateInput(event: Event) {
    const pristine = !this.date
    const input = event.target as HTMLInputElement
    if (input.value) {
      this.date = new Date(input.value)
      localStorage.setItem('date', this.date.getTime().toString())

      this.getCountdown()
      setTimeout(() => {
        const el = document.querySelector('#date')
        if (el) {
          if (pristine) {
            setTimeout(() => this.fitText(el as HTMLElement), 500)
          } else {
            this.fitText(el as HTMLElement)
          }
        }
      }, 10)
    } else {
      this.date = null
      localStorage.removeItem('date')
    }
  }

  getCountdown() {
    const id = setInterval(() => {
      if (this.date) {
        const now = new Date().getTime()
        const diff = this.date.getTime() - now

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        )
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        const dateElement = document.querySelector('#date')
        if (dateElement) {
          dateElement.innerHTML = `${days} days, ${hours}h, ${minutes}m, ${seconds}s`
          if (diff < 0) {
            dateElement.innerHTML = "Hooray! Time's up!"
            clearInterval(id)
          }
        }
      }
    }, 500)
  }
}
