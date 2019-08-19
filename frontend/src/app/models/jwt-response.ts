export interface JwtResponseIFC {
    dataUser:{
        id: number,
        name: string,
        accesToken: string,
        expiresIn: string
    }
}
