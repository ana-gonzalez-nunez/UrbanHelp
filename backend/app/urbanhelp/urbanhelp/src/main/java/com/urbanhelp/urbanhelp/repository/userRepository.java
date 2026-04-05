package main.java.com.urbanhelp.urbanhelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import main.java.com.urbanhelp.urbanhelp.model.usu;

@Repository
//LOS MISMOS QUE LOS MODELOS
public interface userRepository extends JpaRepository<usu, Integer> {

}
