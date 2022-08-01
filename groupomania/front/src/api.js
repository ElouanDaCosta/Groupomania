export const signup = () => {
  return fetch (
    'http://localhost:4000/api/auth/signup', {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      name: document.querySelector('input[name="username"]').value,
      email: document.querySelector('input[name="email"]').value,
      password: document.querySelector('input[name="password"]').value,
      passwordConfirmation: document.querySelector('input[name="passwordConfirmation"]').value
    })
  })
}

export const login = () => {
  return fetch (
    'http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      email: document.querySelector('input[name="email"]').value,
      password: document.querySelector('input[name="password"]').value
    })
  }
  )
}

export const getAll = (order) => {
  const token = localStorage.getItem('token')
  return fetch (
    `http://localhost:4000/api/post/?order=${order}`, {
    method: 'GET',
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    }
  )
}

export const getOne = (id) => {
  const token = localStorage.getItem('token')
  return fetch (
    `http://localhost:4000/api/post/${id}`, {
    method: 'GET',
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    }
  )
}

export const create = (post) => {
  const token = localStorage.getItem('token')
  const formData = new FormData()
  formData.append('text', post.text)
  formData.append('image', post.image)
  return fetch (
    'http://localhost:4000/api/post/', {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: formData
    }
  )
}

export const modifyPost = (id, post) => {
  const token = localStorage.getItem('token')
  const formData = new FormData()
  formData.append('text', post.text)
  formData.append('image', post.image)
      return fetch (
        `http://localhost:4000/api/post/${id}`, {
        method: 'PUT',
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: formData
        }
    )
}

export const deletePost = (id) => {
  const token = localStorage.getItem('token')
  return fetch (
    `http://localhost:4000/api/post/${id}`, {
    method: 'DELETE',
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    }
  )
} 

export const like = (id) => {
  const token = localStorage.getItem('token')
  return fetch (
    `http://localhost:4000/api/post/${id}/like`, {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    }
  )
}

export const logout = () => {
  const token = localStorage.getItem('token')
  return fetch (
    'http://localhost:4000/api/auth/logout', {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    }
  )
}

export const getUser = (user) => {
  const token = localStorage.getItem('token')
  return fetch (
    `http://localhost:4000/api/auth/${user}`, {
    method: 'GET',
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  }
  )
}

export const updateUser = ( user) => {
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('user')
  const formData = new FormData()
  formData.append('name', user.name)
  formData.append('image', user.image)
  return fetch (
    `http://localhost:4000/api/auth/${userId}`, {
    method: 'PUT',
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: formData
    }
  )
}

export const deleteUser = () => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  return fetch (
    `http://localhost:4000/api/auth/${user}`, {
    method: 'DELETE',
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  }
  )
}