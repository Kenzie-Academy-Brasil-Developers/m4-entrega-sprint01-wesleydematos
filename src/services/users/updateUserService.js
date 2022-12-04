import users from "../../database";

export const updateUserService = (body, idUserToUpdate, idRequestUser) => {
  const foundAdm = users.find((user) => user.uuid === idRequestUser);
  const userToUpdate = users.find((user) => user.uuid === idUserToUpdate);
  const indexUserToUpdate = users.findIndex(
    (user) => user.uuid === idUserToUpdate
  );

  const { name, email, password, isAdm, uuid, createdOn } = userToUpdate;

  if (idRequestUser === idUserToUpdate) {
    const data = {
      uuid: uuid,
      name: body.name ? body.name : name,
      email: body.email ? body.email : email,
      isAdm: isAdm,
      createdOn: createdOn,
      updatedOn: new Date(),
    };

    users.splice(indexUserToUpdate, 1, { ...data, password });

    return [200, data];
  }

  if (!userToUpdate) {
    return [
      404,
      {
        message: "User not found!",
      },
    ];
  }

  if (foundAdm.isAdm) {
    const data = {
      uuid: uuid,
      name: body.name ? body.name : name,
      email: body.email ? body.email : email,
      isAdm: isAdm,
      createdOn: createdOn,
      updatedOn: new Date(),
    };

    users.splice(indexUserToUpdate, 1, { ...data, password });

    return [200, data];
  }
};
