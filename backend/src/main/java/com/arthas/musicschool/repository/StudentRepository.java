package com.arthas.musicschool.repository;

import com.arthas.musicschool.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findAllByOrderByNameAsc();

    List<Student> findByStatus(String status);

    List<Student> findByStatusOrderByNameAsc(String status);

    @Query("""
        SELECT s FROM Student s WHERE
        LOWER(s.name) LIKE LOWER(CONCAT('%',:q,'%')) OR
        LOWER(s.instrument) LIKE LOWER(CONCAT('%',:q,'%')) OR
        LOWER(s.teacher) LIKE LOWER(CONCAT('%',:q,'%')) OR
        LOWER(s.cpf) LIKE LOWER(CONCAT('%',:q,'%'))
        ORDER BY s.name
        """)
    List<Student> search(String q);

    @Query("SELECT s FROM Student s WHERE s.lessonDay = :day AND s.lessonTime = :time")
    List<Student> findBySlot(String day, String time);

    @Query("""
        SELECT s FROM Student s WHERE
        (s.lessonDay = :day AND s.lessonTime = :time)
        OR (s.lessonDay2 = :day AND s.lessonTime2 = :time)
        """)
    List<Student> findByAnySlot(String day, String time);

    @Query("SELECT DISTINCT s.instrument FROM Student s WHERE s.instrument IS NOT NULL AND s.instrument <> '' ORDER BY s.instrument")
    List<String> findDistinctInstruments();

    long countByStatus(String status);
}
