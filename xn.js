class SimplePasswordGenerator {
  constructor() {
    this.chars = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%&*()_+-=[]{}|;:,.<>?",
    }

    this.options = {
      length: 12,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
    }

    this.init()
  }

  init() {
    this.getElements()
    this.bindEvents()
    this.generatePassword()
  }

  getElements() {
    this.passwordField = document.getElementById("password")
    this.copyBtn = document.getElementById("copy-btn")
    this.generateBtn = document.getElementById("generate-btn")
    this.lengthSlider = document.getElementById("length")
    this.lengthDisplay = document.getElementById("length-display")
    this.strengthText = document.getElementById("strength-text")
    this.strengthFill = document.getElementById("strength-fill")
    this.toast = document.getElementById("toast")

    // Checkboxes
    this.uppercaseCheck = document.getElementById("uppercase")
    this.lowercaseCheck = document.getElementById("lowercase")
    this.numbersCheck = document.getElementById("numbers")
    this.symbolsCheck = document.getElementById("symbols")

    // Presets
    this.presetBtns = document.querySelectorAll(".preset")
  }

  bindEvents() {
    // Length slider
    this.lengthSlider.addEventListener("input", (e) => {
      this.options.length = Number.parseInt(e.target.value)
      this.lengthDisplay.textContent = this.options.length
      this.generatePassword()
    })

    // Checkboxes
    this.uppercaseCheck.addEventListener("change", (e) => {
      this.options.uppercase = e.target.checked
      this.generatePassword()
    })

    this.lowercaseCheck.addEventListener("change", (e) => {
      this.options.lowercase = e.target.checked
      this.generatePassword()
    })

    this.numbersCheck.addEventListener("change", (e) => {
      this.options.numbers = e.target.checked
      this.generatePassword()
    })

    this.symbolsCheck.addEventListener("change", (e) => {
      this.options.symbols = e.target.checked
      this.generatePassword()
    })

    // Buttons
    this.copyBtn.addEventListener("click", () => this.copyPassword())
    this.generateBtn.addEventListener("click", () => this.generatePassword())

    // Presets
    this.presetBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const preset = e.target.dataset.preset
        this.applyPreset(preset)
      })
    })
  }

  generatePassword() {
    let charset = ""

    if (this.options.uppercase) charset += this.chars.uppercase
    if (this.options.lowercase) charset += this.chars.lowercase
    if (this.options.numbers) charset += this.chars.numbers
    if (this.options.symbols) charset += this.chars.symbols

    if (charset === "") {
      this.showToast("Selecione pelo menos um tipo de caractere!")
      return
    }

    let password = ""
    for (let i = 0; i < this.options.length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    this.passwordField.value = password
    this.updateStrength(charset.length)
  }

  updateStrength(charsetSize) {
    const entropy = this.options.length * Math.log2(charsetSize)
    let strength, strengthClass

    if (entropy < 40) {
      strength = "Fraca"
      strengthClass = "weak"
    } else if (entropy < 60) {
      strength = "Média"
      strengthClass = "medium"
    } else {
      strength = "Forte"
      strengthClass = "strong"
    }

    this.strengthText.textContent = strength
    this.strengthFill.className = `strength-fill ${strengthClass}`
  }

  async copyPassword() {
    try {
      await navigator.clipboard.writeText(this.passwordField.value)
      this.showToast("Senha copiada! ✅")
    } catch (err) {
      // Fallback para navegadores mais antigos
      this.passwordField.select()
      document.execCommand("copy")
      this.showToast("Senha copiada! ✅")
    }
  }

  showToast(message) {
    this.toast.textContent = message
    this.toast.classList.add("show")

    setTimeout(() => {
      this.toast.classList.remove("show")
    }, 2000)
  }

  applyPreset(preset) {
    const presets = {
      simple: { length: 8, uppercase: true, lowercase: true, numbers: true, symbols: false },
      strong: { length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true },
      ultra: { length: 24, uppercase: true, lowercase: true, numbers: true, symbols: true },
    }

    if (presets[preset]) {
      this.options = { ...presets[preset] }
      this.updateUI()
      this.generatePassword()
    }
  }

  updateUI() {
    this.lengthSlider.value = this.options.length
    this.lengthDisplay.textContent = this.options.length
    this.uppercaseCheck.checked = this.options.uppercase
    this.lowercaseCheck.checked = this.options.lowercase
    this.numbersCheck.checked = this.options.numbers
    this.symbolsCheck.checked = this.options.symbols
  }
}

// Inicializar quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  new SimplePasswordGenerator()
})
