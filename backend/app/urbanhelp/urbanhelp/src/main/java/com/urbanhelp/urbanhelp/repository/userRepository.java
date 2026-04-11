package com.urbanhelp.urbanhelp.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.urbanhelp.urbanhelp.model.usu;

@Repository
//LOS MISMOS QUE LOS MODELOS
public interface userRepository extends JpaRepository<usu, Integer> {

}
