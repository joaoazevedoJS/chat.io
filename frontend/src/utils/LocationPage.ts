class LocationPage {
  private getLocation = () => {
    const location = localStorage.getItem('location')
  
    return location
  }
  
  private removeLocation = () => {
    localStorage.removeItem('location')
  }

  public setLocation = () => {
    localStorage.setItem('location', window.location.href)
  }

  public reflashGoBackPage = () => {
    const oldLocation = this.getLocation()
    
    if(!oldLocation) return false

    const newLocation = window.location.href

    if(newLocation !== oldLocation) {
      this.removeLocation()
      
      return window.location.reload()
    }

    return false
  }
}

export default new LocationPage()